/* ============================================
   AI Critical Thinking Lab — Database Layer (IndexedDB via Dexie.js)
   طبقة قاعدة البيانات المحلية
   ============================================ */

const localDb = new Dexie('CriticalThinkingLabDB');

// Define database schema
localDb.version(1).stores({
    users: '++id, &username, passwordHash, role, displayName, lang, createdAt',
    sessions: '++id, userId, challengeId, phase, startedAt, completedAt',
    settings: '&key, value',
    customChallenges: '++id, category, titleAr, titleEn, descAr, descEn, difficulty, createdAt'
});

let db = createDatabase();

// Helper function to hash passwords using SHA-256.
// Web Crypto is only available on secure origins (HTTPS/localhost), so a small
// fallback keeps login/register working on hosts that are opened over HTTP.
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    if (globalThis.crypto && globalThis.crypto.subtle && globalThis.crypto.subtle.digest) {
        const hash = await globalThis.crypto.subtle.digest('SHA-256', data);
        return bytesToHex(new Uint8Array(hash));
    }

    return sha256Fallback(data);
}

function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
}

function sha256Fallback(data) {
    const bytes = Array.from(data);
    const bitLength = bytes.length * 8;
    const hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    bytes.push(0x80);
    while (bytes.length % 64 !== 56) {
        bytes.push(0);
    }
    for (let i = 7; i >= 0; i--) {
        bytes.push(Math.floor(bitLength / Math.pow(2, i * 8)) & 0xff);
    }

    for (let chunk = 0; chunk < bytes.length; chunk += 64) {
        const words = new Array(64);

        for (let i = 0; i < 16; i++) {
            const j = chunk + i * 4;
            words[i] = (
                (bytes[j] << 24) |
                (bytes[j + 1] << 16) |
                (bytes[j + 2] << 8) |
                bytes[j + 3]
            ) >>> 0;
        }

        for (let i = 16; i < 64; i++) {
            const s0 = rightRotate(words[i - 15], 7) ^ rightRotate(words[i - 15], 18) ^ (words[i - 15] >>> 3);
            const s1 = rightRotate(words[i - 2], 17) ^ rightRotate(words[i - 2], 19) ^ (words[i - 2] >>> 10);
            words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0;
        }

        let [a, b, c, d, e, f, g, h] = hash;

        for (let i = 0; i < 64; i++) {
            const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + s1 + ch + k[i] + words[i]) >>> 0;
            const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (s0 + maj) >>> 0;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }

        hash[0] = (hash[0] + a) >>> 0;
        hash[1] = (hash[1] + b) >>> 0;
        hash[2] = (hash[2] + c) >>> 0;
        hash[3] = (hash[3] + d) >>> 0;
        hash[4] = (hash[4] + e) >>> 0;
        hash[5] = (hash[5] + f) >>> 0;
        hash[6] = (hash[6] + g) >>> 0;
        hash[7] = (hash[7] + h) >>> 0;
    }

    return hash.map(value => value.toString(16).padStart(8, '0')).join('');
}

function createDatabase() {
    if (location.protocol === 'http:' || location.protocol === 'https:') {
        return createApiDatabase(localDb);
    }

    return localDb;
}

function createApiDatabase(fallbackDb) {
    let apiBase = (globalThis.CTL_API_BASE || '/api').replace(/\/$/, '');
    let availability = null;

    async function isApiAvailable() {
        if (availability !== null) return availability;

        const candidates = globalThis.CTL_API_BASE
            ? [apiBase]
            : ['/api', '/api.ashx'];

        for (const candidate of candidates) {
            try {
                const response = await fetch(`${candidate}/health`, {
                    credentials: 'same-origin',
                    cache: 'no-store'
                });

                if (response.ok) {
                    apiBase = candidate;
                    availability = true;
                    return availability;
                }
            } catch (err) {
                // Try the next candidate, then fall back to IndexedDB.
            }
        }

        availability = false;
        return availability;
    }

    async function request(path, options = {}) {
        const response = await fetch(`${apiBase}${path}`, {
            credentials: 'same-origin',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `API request failed: ${response.status}`);
        }

        if (response.status === 204) return null;
        return response.json();
    }

    async function remoteOrLocal(remoteAction, localAction) {
        if (await isApiAvailable()) {
            return remoteAction();
        }

        return localAction();
    }

    function table(name) {
        const localTable = fallbackDb[name];

        return {
            async add(item) {
                return remoteOrLocal(
                    async () => {
                        const saved = await request(`/db/${name}`, {
                            method: 'POST',
                            body: JSON.stringify(item)
                        });
                        return saved.id;
                    },
                    () => localTable.add(item)
                );
            },

            async bulkAdd(items) {
                return remoteOrLocal(
                    () => request(`/db/${name}/bulk`, {
                        method: 'POST',
                        body: JSON.stringify(items)
                    }),
                    () => localTable.bulkAdd(items)
                );
            },

            async count() {
                return remoteOrLocal(
                    async () => {
                        const result = await request(`/db/${name}/count`);
                        return result.count;
                    },
                    () => localTable.count()
                );
            },

            async get(key) {
                return remoteOrLocal(
                    () => request(`/db/${name}/${encodeURIComponent(key)}`),
                    () => localTable.get(key)
                );
            },

            async put(item) {
                const key = name === 'settings' ? item.key : item.id;
                return remoteOrLocal(
                    () => request(`/db/${name}/${encodeURIComponent(key)}`, {
                        method: 'PUT',
                        body: JSON.stringify(item)
                    }),
                    () => localTable.put(item)
                );
            },

            async update(id, changes) {
                return remoteOrLocal(
                    () => request(`/db/${name}/${encodeURIComponent(id)}`, {
                        method: 'PATCH',
                        body: JSON.stringify(changes)
                    }),
                    () => localTable.update(id, changes)
                );
            },

            async delete(id) {
                return remoteOrLocal(
                    () => request(`/db/${name}/${encodeURIComponent(id)}`, {
                        method: 'DELETE'
                    }),
                    () => localTable.delete(id)
                );
            },

            async toArray() {
                return remoteOrLocal(
                    () => request(`/db/${name}`),
                    () => localTable.toArray()
                );
            },

            where(field) {
                return {
                    equals(value) {
                        return {
                            async first() {
                                return remoteOrLocal(
                                    async () => {
                                        const rows = await request(`/db/${name}/query?field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`);
                                        return rows[0];
                                    },
                                    () => localTable.where(field).equals(value).first()
                                );
                            },

                            async toArray() {
                                return remoteOrLocal(
                                    () => request(`/db/${name}/query?field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`),
                                    () => localTable.where(field).equals(value).toArray()
                                );
                            }
                        };
                    }
                };
            }
        };
    }

    return {
        users: table('users'),
        sessions: table('sessions'),
        settings: table('settings'),
        customChallenges: table('customChallenges')
    };
}

async function ensureDefaultData(targetDb = db) {
    const settingsCount = await targetDb.settings.count();
    if (settingsCount === 0) {
        await targetDb.settings.bulkAdd([
            { key: 'openai_api_key', value: '' },
            { key: 'openai_model', value: 'gpt-5.2' }
        ]);
    }

    const teacher = await targetDb.users.where('username').equals('teacher').first();
    if (!teacher) {
        const teacherPasswordHash = await hashPassword('teacher123');
        await targetDb.users.add({
            username: 'teacher',
            passwordHash: teacherPasswordHash,
            role: 'teacher',
            displayName: 'المعلم المشرف',
            lang: 'ar',
            createdAt: new Date().toISOString()
        });
    }
}

// Prepopulate settings and a default teacher account if database is newly created
localDb.on('populate', async () => {
    await ensureDefaultData(localDb);
    console.log('Database populated with default settings and teacher account.');
});

// Open database connection
localDb.open().then(() => ensureDefaultData(localDb)).catch(err => {
    console.error('Failed to open database: ', err.stack || err);
});
