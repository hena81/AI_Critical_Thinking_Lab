using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var database = new JsonFileDatabase(app.Environment.ContentRootPath);
await database.EnsureDefaultDataAsync();

app.Use(async (context, next) =>
{
    if ((context.Request.Path.Value ?? "").StartsWith("/App_Data", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    await next();
});

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(app.Environment.ContentRootPath)
});

app.MapGet("/api/health", () => Results.Ok(new { ok = true }));

app.MapGet("/api/db/{table}", async (string table) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    return Results.Json(await database.GetAllAsync(table));
});

app.MapGet("/api/db/{table}/count", async (string table) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    return Results.Ok(new { count = await database.CountAsync(table) });
});

app.MapGet("/api/db/{table}/query", async (string table, string field, string value) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    return Results.Json(await database.QueryAsync(table, field, value));
});

app.MapGet("/api/db/{table}/{key}", async (string table, string key) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();

    var item = await database.GetAsync(table, key);
    return item is null ? Results.Json(null) : Results.Json(item);
});

app.MapPost("/api/db/{table}", async (string table, JsonObject item) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    return Results.Json(await database.AddAsync(table, item));
});

app.MapPost("/api/db/{table}/bulk", async (string table, JsonArray items) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    await database.BulkAddAsync(table, items);
    return Results.Ok(new { ok = true });
});

app.MapPut("/api/db/{table}/{key}", async (string table, string key, JsonObject item) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    return Results.Json(await database.PutAsync(table, key, item));
});

app.MapPatch("/api/db/{table}/{key}", async (string table, string key, JsonObject changes) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    var updated = await database.UpdateAsync(table, key, changes);
    return updated ? Results.Ok(new { ok = true }) : Results.NotFound();
});

app.MapDelete("/api/db/{table}/{key}", async (string table, string key) =>
{
    if (!JsonFileDatabase.IsValidTable(table)) return Results.NotFound();
    await database.DeleteAsync(table, key);
    return Results.NoContent();
});

app.MapFallback(async context =>
{
    var path = context.Request.Path.Value ?? "/";
    if (path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    await Task.CompletedTask;
});

app.Run();

sealed class JsonFileDatabase
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    private static readonly HashSet<string> Tables = new(StringComparer.OrdinalIgnoreCase)
    {
        "users",
        "sessions",
        "settings",
        "customChallenges"
    };

    private readonly string dataDirectory;
    private readonly ConcurrentDictionary<string, SemaphoreSlim> locks = new(StringComparer.OrdinalIgnoreCase);

    public JsonFileDatabase(string contentRoot)
    {
        dataDirectory = Path.Combine(contentRoot, "App_Data");
        Directory.CreateDirectory(dataDirectory);
    }

    public static bool IsValidTable(string table) => Tables.Contains(table);

    public async Task EnsureDefaultDataAsync()
    {
        foreach (var table in Tables)
        {
            await WithLockAsync(table, async () =>
            {
                var path = GetPath(table);
                if (!File.Exists(path))
                {
                    await File.WriteAllTextAsync(path, "[]", Encoding.UTF8);
                }
            });
        }

        if (await CountAsync("settings") == 0)
        {
            await BulkAddAsync("settings", new JsonArray
            {
                new JsonObject { ["key"] = "openai_api_key", ["value"] = "" },
                new JsonObject { ["key"] = "openai_model", ["value"] = "gpt-5.2" }
            });
        }

        var teacher = await FirstAsync("users", "username", "teacher");
        if (teacher is null)
        {
            await AddAsync("users", new JsonObject
            {
                ["username"] = "teacher",
                ["passwordHash"] = Sha256Hex("teacher123"),
                ["role"] = "teacher",
                ["displayName"] = "المعلم المشرف",
                ["lang"] = "ar",
                ["createdAt"] = DateTimeOffset.UtcNow.ToString("O")
            });
        }

        var student = await FirstAsync("users", "username", "student");
        if (student is null)
        {
            await AddAsync("users", new JsonObject
            {
                ["username"] = "student",
                ["passwordHash"] = Sha256Hex("student123"),
                ["role"] = "student",
                ["displayName"] = "طالب تجريبي",
                ["lang"] = "ar",
                ["createdAt"] = DateTimeOffset.UtcNow.ToString("O")
            });
        }
    }

    public Task<int> CountAsync(string table) => WithLockAsync(table, async () => (await ReadAsync(table)).Count);

    public Task<JsonArray> GetAllAsync(string table) =>
        WithLockAsync(table, async () => CloneArray(await ReadAsync(table)));

    public Task<JsonNode?> GetAsync(string table, string key) =>
        WithLockAsync(table, async () => CloneNode(Find(await ReadAsync(table), table, key)));

    public Task<JsonArray> QueryAsync(string table, string field, string value) =>
        WithLockAsync(table, async () =>
        {
            var rows = await ReadAsync(table);
            var result = new JsonArray();

            foreach (var row in rows.OfType<JsonObject>())
            {
                if (Matches(row, field, value))
                {
                    result.Add(CloneNode(row));
                }
            }

            return result;
        });

    public Task<JsonObject> AddAsync(string table, JsonObject item) =>
        WithLockAsync(table, async () =>
        {
            var rows = await ReadAsync(table);
            var copy = CloneObject(item);

            if (!table.Equals("settings", StringComparison.OrdinalIgnoreCase))
            {
                copy["id"] = NextId(rows);
            }

            rows.Add(copy);
            await WriteAsync(table, rows);
            return CloneObject(copy);
        });

    public Task BulkAddAsync(string table, JsonArray items) =>
        WithLockAsync(table, async () =>
        {
            var rows = await ReadAsync(table);

            foreach (var item in items.OfType<JsonObject>())
            {
                var copy = CloneObject(item);
                if (!table.Equals("settings", StringComparison.OrdinalIgnoreCase) && copy["id"] is null)
                {
                    copy["id"] = NextId(rows);
                }

                rows.Add(copy);
            }

            await WriteAsync(table, rows);
        });

    public Task<JsonObject> PutAsync(string table, string key, JsonObject item) =>
        WithLockAsync(table, async () =>
        {
            var rows = await ReadAsync(table);
            var existingIndex = FindIndex(rows, table, key);
            var copy = CloneObject(item);

            if (existingIndex >= 0)
            {
                rows[existingIndex] = copy;
            }
            else
            {
                rows.Add(copy);
            }

            await WriteAsync(table, rows);
            return CloneObject(copy);
        });

    public Task<bool> UpdateAsync(string table, string key, JsonObject changes) =>
        WithLockAsync(table, async () =>
        {
            var rows = await ReadAsync(table);
            var index = FindIndex(rows, table, key);
            if (index < 0 || rows[index] is not JsonObject existing)
            {
                return false;
            }

            foreach (var property in changes)
            {
                existing[property.Key] = CloneNode(property.Value);
            }

            await WriteAsync(table, rows);
            return true;
        });

    public Task DeleteAsync(string table, string key) =>
        WithLockAsync(table, async () =>
        {
            var rows = await ReadAsync(table);
            var index = FindIndex(rows, table, key);
            if (index >= 0)
            {
                rows.RemoveAt(index);
                await WriteAsync(table, rows);
            }
        });

    private async Task<JsonObject?> FirstAsync(string table, string field, string value)
    {
        var rows = await QueryAsync(table, field, value);
        return rows.FirstOrDefault() as JsonObject;
    }

    private string GetPath(string table) => Path.Combine(dataDirectory, $"{table}.json");

    private async Task<T> WithLockAsync<T>(string table, Func<Task<T>> action)
    {
        var gate = locks.GetOrAdd(table, _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync();
        try
        {
            return await action();
        }
        finally
        {
            gate.Release();
        }
    }

    private async Task WithLockAsync(string table, Func<Task> action)
    {
        await WithLockAsync(table, async () =>
        {
            await action();
            return true;
        });
    }

    private async Task<JsonArray> ReadAsync(string table)
    {
        var path = GetPath(table);
        if (!File.Exists(path))
        {
            return new JsonArray();
        }

        var json = await File.ReadAllTextAsync(path, Encoding.UTF8);
        return JsonNode.Parse(string.IsNullOrWhiteSpace(json) ? "[]" : json) as JsonArray ?? new JsonArray();
    }

    private async Task WriteAsync(string table, JsonArray rows)
    {
        await File.WriteAllTextAsync(GetPath(table), rows.ToJsonString(JsonOptions), Encoding.UTF8);
    }

    private static int NextId(JsonArray rows)
    {
        var max = rows.OfType<JsonObject>()
            .Select(row =>
            {
                var idText = row["id"]?.ToString();
                return int.TryParse(idText, out var id) ? id : 0;
            })
            .DefaultIfEmpty(0)
            .Max();

        return max + 1;
    }

    private static JsonObject? Find(JsonArray rows, string table, string key)
    {
        var index = FindIndex(rows, table, key);
        return index >= 0 ? rows[index] as JsonObject : null;
    }

    private static int FindIndex(JsonArray rows, string table, string key)
    {
        var keyField = table.Equals("settings", StringComparison.OrdinalIgnoreCase) ? "key" : "id";

        for (var i = 0; i < rows.Count; i++)
        {
            if (rows[i] is JsonObject row && Matches(row, keyField, key))
            {
                return i;
            }
        }

        return -1;
    }

    private static bool Matches(JsonObject row, string field, string value)
    {
        if (!row.TryGetPropertyValue(field, out var node) || node is null)
        {
            return false;
        }

        return node.ToString().Equals(value, StringComparison.OrdinalIgnoreCase);
    }

    private static JsonArray CloneArray(JsonArray rows)
    {
        var clone = new JsonArray();
        foreach (var row in rows)
        {
            clone.Add(CloneNode(row));
        }

        return clone;
    }

    private static JsonObject CloneObject(JsonObject item) =>
        CloneNode(item) as JsonObject ?? new JsonObject();

    private static JsonNode? CloneNode(JsonNode? node) =>
        node is null ? null : JsonNode.Parse(node.ToJsonString());

    private static string Sha256Hex(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
