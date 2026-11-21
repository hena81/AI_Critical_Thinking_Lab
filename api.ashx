<%@ WebHandler Language="C#" Class="ApiHandler" %>

using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

public class ApiHandler : IHttpHandler
{
    private static readonly JavaScriptSerializer Serializer = new JavaScriptSerializer { MaxJsonLength = int.MaxValue };
    private static readonly HashSet<string> Tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "users",
        "sessions",
        "settings",
        "customChallenges"
    };
    private static readonly object SyncRoot = new object();

    public bool IsReusable { get { return false; } }

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json; charset=utf-8";

        try
        {
            EnsureDefaultData(context);
            HandleRequest(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            WriteJson(context, new Dictionary<string, object>
            {
                { "error", ex.Message }
            });
        }
    }

    private static void HandleRequest(HttpContext context)
    {
        var parts = GetPathParts(context);
        var method = context.Request.HttpMethod.ToUpperInvariant();

        if (parts.Length == 1 && parts[0].Equals("health", StringComparison.OrdinalIgnoreCase))
        {
            WriteJson(context, new Dictionary<string, object> { { "ok", true } });
            return;
        }

        if (parts.Length == 2 &&
            parts[0].Equals("settings", StringComparison.OrdinalIgnoreCase) &&
            parts[1].Equals("openai", StringComparison.OrdinalIgnoreCase))
        {
            HandleOpenAISettings(context, method);
            return;
        }

        if (parts.Length == 2 &&
            parts[0].Equals("openai", StringComparison.OrdinalIgnoreCase) &&
            parts[1].Equals("chat-completions", StringComparison.OrdinalIgnoreCase))
        {
            HandleOpenAIProxy(context, method);
            return;
        }

        if (parts.Length < 2 || !parts[0].Equals("db", StringComparison.OrdinalIgnoreCase) || !Tables.Contains(parts[1]))
        {
            context.Response.StatusCode = 404;
            WriteJson(context, new Dictionary<string, object> { { "error", "Not found" } });
            return;
        }

        var table = parts[1];

        lock (SyncRoot)
        {
            if (method == "GET" && parts.Length == 2)
            {
                WriteJson(context, ReadTable(context, table));
                return;
            }

            if (method == "GET" && parts.Length == 3 && parts[2].Equals("count", StringComparison.OrdinalIgnoreCase))
            {
                WriteJson(context, new Dictionary<string, object> { { "count", ReadTable(context, table).Count } });
                return;
            }

            if (method == "GET" && parts.Length == 3 && parts[2].Equals("query", StringComparison.OrdinalIgnoreCase))
            {
                var field = context.Request.QueryString["field"] ?? "";
                var value = context.Request.QueryString["value"] ?? "";
                var rows = ReadTable(context, table)
                    .Where(row => Matches(row, field, value))
                    .ToList();
                WriteJson(context, rows);
                return;
            }

            if (method == "GET" && parts.Length == 3)
            {
                WriteJson(context, Find(ReadTable(context, table), table, parts[2]));
                return;
            }

            if (method == "POST" && parts.Length == 2)
            {
                var rows = ReadTable(context, table);
                var item = ReadBodyObject(context);

                if (!table.Equals("settings", StringComparison.OrdinalIgnoreCase))
                {
                    item["id"] = NextId(rows);
                }

                rows.Add(item);
                WriteTable(context, table, rows);
                WriteJson(context, item);
                return;
            }

            if (method == "POST" && parts.Length == 3 && parts[2].Equals("bulk", StringComparison.OrdinalIgnoreCase))
            {
                var rows = ReadTable(context, table);
                foreach (var item in ReadBodyArray(context))
                {
                    if (!table.Equals("settings", StringComparison.OrdinalIgnoreCase) && !item.ContainsKey("id"))
                    {
                        item["id"] = NextId(rows);
                    }

                    rows.Add(item);
                }

                WriteTable(context, table, rows);
                WriteJson(context, new Dictionary<string, object> { { "ok", true } });
                return;
            }

            if (method == "PUT" && parts.Length == 3)
            {
                var rows = ReadTable(context, table);
                var item = ReadBodyObject(context);
                var index = FindIndex(rows, table, parts[2]);

                if (index >= 0)
                {
                    rows[index] = item;
                }
                else
                {
                    rows.Add(item);
                }

                WriteTable(context, table, rows);
                WriteJson(context, item);
                return;
            }

            if (method == "PATCH" && parts.Length == 3)
            {
                var rows = ReadTable(context, table);
                var index = FindIndex(rows, table, parts[2]);
                if (index < 0)
                {
                    context.Response.StatusCode = 404;
                    WriteJson(context, new Dictionary<string, object> { { "error", "Not found" } });
                    return;
                }

                var changes = ReadBodyObject(context);
                foreach (var change in changes)
                {
                    rows[index][change.Key] = change.Value;
                }

                WriteTable(context, table, rows);
                WriteJson(context, new Dictionary<string, object> { { "ok", true } });
                return;
            }

            if (method == "DELETE" && parts.Length == 3)
            {
                var rows = ReadTable(context, table);
                var index = FindIndex(rows, table, parts[2]);
                if (index >= 0)
                {
                    rows.RemoveAt(index);
                    WriteTable(context, table, rows);
                }

                context.Response.StatusCode = 204;
                return;
            }
        }

        context.Response.StatusCode = 405;
        WriteJson(context, new Dictionary<string, object> { { "error", "Method not allowed" } });
    }

    private static void HandleOpenAISettings(HttpContext context, string method)
    {
        lock (SyncRoot)
        {
            if (method == "GET")
            {
                var apiKey = GetSetting(context, "openai_api_key");
                var model = GetSetting(context, "openai_model");
                WriteJson(context, new Dictionary<string, object>
                {
                    { "hasApiKey", !string.IsNullOrWhiteSpace(apiKey) },
                    { "model", string.IsNullOrWhiteSpace(model) ? "gpt-5.2" : model }
                });
                return;
            }

            if (method == "POST")
            {
                var body = ReadBodyObject(context);

                if (body.ContainsKey("apiKey"))
                {
                    SetSetting(context, "openai_api_key", body["apiKey"] == null ? "" : body["apiKey"].ToString());
                }

                if (body.ContainsKey("model"))
                {
                    SetSetting(context, "openai_model", body["model"] == null ? "gpt-5.2" : body["model"].ToString());
                }

                var apiKey = GetSetting(context, "openai_api_key");
                var model = GetSetting(context, "openai_model");
                WriteJson(context, new Dictionary<string, object>
                {
                    { "ok", true },
                    { "hasApiKey", !string.IsNullOrWhiteSpace(apiKey) },
                    { "model", string.IsNullOrWhiteSpace(model) ? "gpt-5.2" : model }
                });
                return;
            }
        }

        context.Response.StatusCode = 405;
        WriteJson(context, new Dictionary<string, object> { { "error", "Method not allowed" } });
    }

    private static void HandleOpenAIProxy(HttpContext context, string method)
    {
        if (method != "POST")
        {
            context.Response.StatusCode = 405;
            WriteJson(context, new Dictionary<string, object> { { "error", "Method not allowed" } });
            return;
        }

        var apiKey = GetSetting(context, "openai_api_key");
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            context.Response.StatusCode = 400;
            WriteJson(context, new Dictionary<string, object> { { "error", "OpenAI API key is not configured." } });
            return;
        }

        var requestBody = new StreamReader(context.Request.InputStream, Encoding.UTF8).ReadToEnd();
        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        var request = (HttpWebRequest)WebRequest.Create("https://api.openai.com/v1/chat/completions");
        request.Method = "POST";
        request.ContentType = "application/json";
        request.Headers["Authorization"] = "Bearer " + apiKey;

        var bytes = Encoding.UTF8.GetBytes(requestBody);
        request.ContentLength = bytes.Length;

        using (var stream = request.GetRequestStream())
        {
            stream.Write(bytes, 0, bytes.Length);
        }

        try
        {
            using (var response = (HttpWebResponse)request.GetResponse())
            using (var reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
            {
                context.Response.StatusCode = (int)response.StatusCode;
                context.Response.Write(reader.ReadToEnd());
            }
        }
        catch (WebException ex)
        {
            var response = ex.Response as HttpWebResponse;
            context.Response.StatusCode = response == null ? 500 : (int)response.StatusCode;

            if (response != null)
            {
                using (var reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
                {
                    context.Response.Write(reader.ReadToEnd());
                    return;
                }
            }

            WriteJson(context, new Dictionary<string, object> { { "error", ex.Message } });
        }
    }

    private static string[] GetPathParts(HttpContext context)
    {
        var path = context.Request.PathInfo;
        if (string.IsNullOrWhiteSpace(path))
        {
            var appRelative = context.Request.AppRelativeCurrentExecutionFilePath ?? "";
            var marker = "api.ashx";
            var markerIndex = appRelative.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
            path = markerIndex >= 0 ? appRelative.Substring(markerIndex + marker.Length) : "";
        }

        return path.Trim('/').Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(HttpUtility.UrlDecode)
            .ToArray();
    }

    private static void EnsureDefaultData(HttpContext context)
    {
        lock (SyncRoot)
        {
            foreach (var table in Tables)
            {
                var path = GetTablePath(context, table);
                var directory = Path.GetDirectoryName(path);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                if (!File.Exists(path))
                {
                    File.WriteAllText(path, "[]", Encoding.UTF8);
                }
            }

            var settings = ReadTable(context, "settings");
            if (settings.Count == 0)
            {
                settings.Add(new Dictionary<string, object> { { "key", "openai_api_key" }, { "value", "" } });
                settings.Add(new Dictionary<string, object> { { "key", "openai_model" }, { "value", "gpt-5.2" } });
                WriteTable(context, "settings", settings);
            }

            var users = ReadTable(context, "users");
            if (!users.Any(user => Matches(user, "username", "teacher")))
            {
                users.Add(new Dictionary<string, object>
                {
                    { "id", NextId(users) },
                    { "username", "teacher" },
                    { "passwordHash", Sha256Hex("teacher123") },
                    { "role", "teacher" },
                    { "displayName", "المعلم المشرف" },
                    { "lang", "ar" },
                    { "createdAt", DateTime.UtcNow.ToString("O") }
                });
                WriteTable(context, "users", users);
            }
        }
    }

    private static string GetTablePath(HttpContext context, string table)
    {
        return context.Server.MapPath("~/App_Data/" + table + ".json");
    }

    private static List<Dictionary<string, object>> ReadTable(HttpContext context, string table)
    {
        var path = GetTablePath(context, table);
        if (!File.Exists(path))
        {
            return new List<Dictionary<string, object>>();
        }

        var json = File.ReadAllText(path, Encoding.UTF8);
        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<Dictionary<string, object>>();
        }

        var array = Serializer.DeserializeObject(json) as object[];
        if (array == null)
        {
            return new List<Dictionary<string, object>>();
        }

        return array
            .OfType<Dictionary<string, object>>()
            .ToList();
    }

    private static void WriteTable(HttpContext context, string table, List<Dictionary<string, object>> rows)
    {
        File.WriteAllText(GetTablePath(context, table), Serializer.Serialize(rows), Encoding.UTF8);
    }

    private static string GetSetting(HttpContext context, string key)
    {
        var row = Find(ReadTable(context, "settings"), "settings", key);
        object value;
        return row != null && row.TryGetValue("value", out value) && value != null ? value.ToString() : "";
    }

    private static void SetSetting(HttpContext context, string key, string value)
    {
        var rows = ReadTable(context, "settings");
        var index = FindIndex(rows, "settings", key);
        var item = new Dictionary<string, object> { { "key", key }, { "value", value ?? "" } };

        if (index >= 0)
        {
            rows[index] = item;
        }
        else
        {
            rows.Add(item);
        }

        WriteTable(context, "settings", rows);
    }

    private static Dictionary<string, object> ReadBodyObject(HttpContext context)
    {
        var body = new StreamReader(context.Request.InputStream, Encoding.UTF8).ReadToEnd();
        return Serializer.DeserializeObject(body) as Dictionary<string, object> ?? new Dictionary<string, object>();
    }

    private static List<Dictionary<string, object>> ReadBodyArray(HttpContext context)
    {
        var body = new StreamReader(context.Request.InputStream, Encoding.UTF8).ReadToEnd();
        var array = Serializer.DeserializeObject(body) as object[];
        if (array == null)
        {
            return new List<Dictionary<string, object>>();
        }

        return array.OfType<Dictionary<string, object>>().ToList();
    }

    private static Dictionary<string, object> Find(List<Dictionary<string, object>> rows, string table, string key)
    {
        var index = FindIndex(rows, table, key);
        return index >= 0 ? rows[index] : null;
    }

    private static int FindIndex(List<Dictionary<string, object>> rows, string table, string key)
    {
        var keyField = table.Equals("settings", StringComparison.OrdinalIgnoreCase) ? "key" : "id";

        for (var i = 0; i < rows.Count; i++)
        {
            if (Matches(rows[i], keyField, key))
            {
                return i;
            }
        }

        return -1;
    }

    private static bool Matches(Dictionary<string, object> row, string field, string value)
    {
        object current;
        return row.TryGetValue(field, out current) &&
            current != null &&
            current.ToString().Equals(value, StringComparison.OrdinalIgnoreCase);
    }

    private static int NextId(List<Dictionary<string, object>> rows)
    {
        var max = 0;

        foreach (var row in rows)
        {
            object value;
            int id;
            if (row.TryGetValue("id", out value) && value != null && int.TryParse(value.ToString(), out id))
            {
                max = Math.Max(max, id);
            }
        }

        return max + 1;
    }

    private static string Sha256Hex(string value)
    {
        using (var sha = SHA256.Create())
        {
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(value));
            var builder = new StringBuilder(bytes.Length * 2);
            foreach (var b in bytes)
            {
                builder.Append(b.ToString("x2"));
            }

            return builder.ToString();
        }
    }

    private static void WriteJson(HttpContext context, object value)
    {
        context.Response.Write(Serializer.Serialize(value));
    }
}
