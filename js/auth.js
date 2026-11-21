/* ============================================
   AI Critical Thinking Lab — Authentication System
   نظام المصادقة وإدارة الجلسات والأدوار
   ============================================ */

const Auth = (() => {
    // Current user in memory
    let currentUser = null;

    /**
     * Get the logged-in user from localStorage/sessionStorage
     */
    function getCurrentUser() {
        if (!currentUser) {
            const saved = localStorage.getItem('ctlab_user');
            if (saved) {
                try {
                    currentUser = JSON.parse(saved);
                } catch (e) {
                    localStorage.removeItem('ctlab_user');
                }
            }
        }
        return currentUser;
    }

    /**
     * Check if a user is authenticated
     */
    function isAuthenticated() {
        return getCurrentUser() !== null;
    }

    /**
     * Check if the current user is a teacher
     */
    function isTeacher() {
        const user = getCurrentUser();
        return user && user.role === 'teacher';
    }

    /**
     * Register a new user
     */
    async function register(username, password, displayName, role) {
        if (!username || !password || !displayName || !role) {
            throw new Error('auth.error.empty');
        }

        const normalizedUsername = username.toLowerCase().trim();
        const normalizedDisplayName = displayName.trim();

        if (!normalizedUsername || !normalizedDisplayName) {
            throw new Error('auth.error.empty');
        }

        // Check if user already exists
        const existing = await db.users.where('username').equals(normalizedUsername).first();
        if (existing) {
            throw new Error('auth.error.exists');
        }

        if (password.length < 4) {
            throw new Error('auth.error.short');
        }

        const passwordHash = await hashPassword(password);
        const lang = I18n.getLang() || 'ar';

        const userId = await db.users.add({
            username: normalizedUsername,
            passwordHash,
            role,
            displayName: normalizedDisplayName,
            lang,
            createdAt: new Date().toISOString()
        });

        // Get the newly created user
        const newUser = await db.users.get(userId);
        delete newUser.passwordHash; // Don't keep hash in memory

        return newUser;
    }

    /**
     * Login user
     */
    async function login(username, password) {
        if (!username || !password) {
            throw new Error('auth.error.empty');
        }

        const user = await db.users.where('username').equals(username.toLowerCase().trim()).first();
        if (!user) {
            throw new Error('auth.error.invalid');
        }

        const passwordHash = await hashPassword(password);
        if (user.passwordHash !== passwordHash) {
            throw new Error('auth.error.invalid');
        }

        const selectedLang = (typeof I18n !== 'undefined' && I18n.getLang()) ? I18n.getLang() : (user.lang || 'ar');

        // Clean user object for memory & session storage
        const sessionUser = {
            id: user.id,
            username: user.username,
            role: user.role,
            displayName: user.displayName,
            lang: selectedLang
        };

        currentUser = sessionUser;
        localStorage.setItem('ctlab_user', JSON.stringify(sessionUser));

        // Keep the language chosen on the login screen and save it as the user's preference.
        if (user.lang !== selectedLang) {
            await db.users.update(user.id, { lang: selectedLang });
        }

        if (typeof I18n !== 'undefined') {
            I18n.setLang(selectedLang);
        }

        return sessionUser;
    }

    /**
     * Logout user
     */
    function logout() {
        currentUser = null;
        localStorage.removeItem('ctlab_user');
    }

    /**
     * Update user language preference in database
     */
    async function updateLangPreference(lang) {
        const user = getCurrentUser();
        if (user) {
            await db.users.update(user.id, { lang });
            user.lang = lang;
            localStorage.setItem('ctlab_user', JSON.stringify(user));
        }
    }

    return {
        getCurrentUser,
        isAuthenticated,
        isTeacher,
        register,
        login,
        logout,
        updateLangPreference
    };
})();
