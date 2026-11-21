/* ============================================
   AI Critical Thinking Lab — Main Application Logic
   المنطق الرئيسي للتطبيق، التوجيه، وإدارة واجهة المستخدم
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize components
    I18n.init();
    App.init();
    Particles.init();
});

/* ===== Particles Animation Background ===== */
const Particles = (() => {
    let canvas, ctx;
    let particlesArray = [];
    const colors = ['#00d4ff', '#7c3aed', '#a855f7'];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
    }

    function init() {
        canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);

        // Generate particles
        particlesArray = [];
        const numberOfParticles = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }

        animate();
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    return { init };
})();

/* ===== Main Application SPA logic ===== */
const App = (() => {
    // Current state variables
    let activePage = 'auth';
    let currentSession = null;
    let activeChallenge = null;

    /**
     * Initialize Application hooks and triggers
     */
    function init() {
        setupNavigation();
        setupAuthForms();
        setupLanguageToggle();
        setupMobileMenu();
        
        // Show initial page depending on session state
        if (Auth.isAuthenticated()) {
            navigateTo('home');
        } else {
            navigateTo('auth');
        }
    }

    /**
     * Show custom toast notification
     */
    function showToast(messageKey, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
        const text = I18n.t(messageKey);

        toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${text}</span>`;
        container.appendChild(toast);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    }

    /**
     * Setup SPA Router and Navbar interactions
     */
    function setupNavigation() {
        // App brand logo clicks navigate home
        document.getElementById('navBrand').addEventListener('click', (e) => {
            e.preventDefault();
            if (Auth.isAuthenticated()) navigateTo('home');
            else navigateTo('about');
        });

        // Navigation links click handlers
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const page = el.getAttribute('data-page');
                if (page) navigateTo(page);
                
                // Hide dropdown menu on click
                const dd = document.getElementById('userDropdown');
                if (dd) dd.classList.remove('show');
                // Hide mobile menu on click
                const nl = document.getElementById('navLinks');
                if (nl) nl.classList.remove('show');
            });
        });

        // Login button in navbar (for guests)
        const navLoginBtn = document.getElementById('navLoginBtn');
        if (navLoginBtn) {
            navLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('auth');
            });
        }

        // About button on Auth card
        const authAboutBtn = document.getElementById('authAboutBtn');
        if (authAboutBtn) {
            authAboutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('about');
            });
        }

        // User Avatar menu toggles dropdown
        const avatar = document.getElementById('userAvatar');
        const dropdown = document.getElementById('userDropdown');
        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });

        // Logout action trigger
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
            navigateTo('auth');
            showToast('auth.success.logout', 'info');
        });

        // Navbar scrolling effects
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    /**
     * Setup authentication actions: Login, Signup, toggle roles
     */
    function setupAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        const authSwitchText = document.getElementById('authSwitchText');
        const loginError = document.getElementById('loginError');
        const registerError = document.getElementById('registerError');

        // Switch Forms trigger (Login <-> Register)
        authSwitchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isLoginHidden = loginForm.classList.contains('hidden');
            if (isLoginHidden) {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                authSwitchText.setAttribute('data-i18n', 'auth.noAccount');
                authSwitchBtn.setAttribute('data-i18n', 'auth.createAccount');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
                authSwitchText.setAttribute('data-i18n', 'auth.hasAccount');
                authSwitchBtn.setAttribute('data-i18n', 'auth.loginInstead');
            }
            loginError.textContent = '';
            registerError.textContent = '';
            I18n.setLang(I18n.getLang()); // Reforce translation of switch button texts
        });

        // Form Role radio custom styles selector logic
        document.querySelectorAll('.role-option input').forEach(radio => {
            radio.addEventListener('change', () => {
                document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('selected'));
                radio.closest('.role-option').classList.add('selected');
            });
        });

        // Handle Login Submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.textContent = '';
            const u = document.getElementById('loginUsername').value;
            const p = document.getElementById('loginPassword').value;

            try {
                const user = await Auth.login(u, p);
                loginForm.reset();
                navigateTo('home');
                showToast('auth.success.login', 'success');
            } catch (err) {
                console.error(err);
                loginError.textContent = I18n.t(err.message);
            }
        });

        // Handle Signup Submission
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerError.textContent = '';
            const disp = document.getElementById('regDisplayName').value;
            const u = document.getElementById('regUsername').value;
            const p = document.getElementById('regPassword').value;
            const r = registerForm.querySelector('input[name="role"]:checked').value;

            try {
                await Auth.register(u, p, disp, r);
                registerForm.reset();
                
                // Show login form with success note
                authSwitchBtn.click();
                showToast('auth.success.register', 'success');
            } catch (err) {
                console.error(err);
                registerError.textContent = I18n.t(err.message);
            }
        });
    }

    /**
     * Setup language preferences hooks
     */
    function setupLanguageToggle() {
        document.getElementById('langToggle').addEventListener('click', () => {
            I18n.toggle();
            Auth.updateLangPreference(I18n.getLang());
            
            // Re-render pages if needed
            if (activePage === 'home') renderHomePage();
            if (activePage === 'about') renderAboutPage();
            if (activePage === 'challenges') renderChallengesPage();
            if (activePage === 'profile') renderProfilePage();
            if (activePage === 'dashboard') renderDashboardPage();
            if (activePage === 'session') renderSessionPhase();
        });

        document.querySelectorAll('[data-auth-lang]').forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-auth-lang');
                if (lang && lang !== I18n.getLang()) {
                    I18n.setLang(lang);
                    Auth.updateLangPreference(lang);
                }
            });
        });
    }

    /**
     * Setup mobile menu navigation drawer toggle
     */
    function setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const links = document.getElementById('navLinks');
        toggle.addEventListener('click', () => {
            links.classList.toggle('show');
        });
    }

    /**
     * SPA page router navigation handler
     */
    function navigateTo(pageId) {
        // Enforce route protection: redirect if unauthorized (allow 'auth' and 'about' publicly)
        if (pageId !== 'auth' && pageId !== 'about' && !Auth.isAuthenticated()) {
            pageId = 'auth';
        }

        // Hide navigation bar on auth screen
        const navbar = document.getElementById('navbar');
        if (pageId === 'auth') {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        // Update auth/user menu state in navbar
        const userMenu = document.getElementById('userMenu');
        const navLoginBtn = document.getElementById('navLoginBtn');
        if (Auth.isAuthenticated()) {
            if (userMenu) userMenu.classList.remove('hidden');
            if (navLoginBtn) navLoginBtn.classList.add('hidden');
        } else {
            if (userMenu) userMenu.classList.add('hidden');
            if (navLoginBtn) navLoginBtn.classList.remove('hidden');
        }

        // Update active class in links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('link-active'); // Cleanup
                link.classList.remove('active');
            }
        });

        // Hide all screens, show requested page screen
        document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
        
        const targetPage = document.getElementById(`page${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            activePage = pageId;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Execute specific page loading/render logic
        if (pageId === 'home') renderHomePage();
        if (pageId === 'about') renderAboutPage();
        if (pageId === 'challenges') renderChallengesPage();
        if (pageId === 'profile') renderProfilePage();
        if (pageId === 'dashboard') {
            if (!Auth.isTeacher()) {
                navigateTo('home');
            } else {
                renderDashboardPage();
            }
        }

        // Show/hide teacher links
        if (Auth.isAuthenticated()) {
            document.getElementById('dropdownName').textContent = Auth.getCurrentUser().displayName;
            
            const isTeacherRole = Auth.isTeacher();
            document.getElementById('dropdownRole').textContent = I18n.t(isTeacherRole ? 'auth.teacher' : 'auth.student');
            
            document.querySelectorAll('.teacher-only').forEach(el => {
                if (isTeacherRole) el.classList.remove('hidden');
                else el.classList.add('hidden');
            });
        }
    }

    /* ===== Render Page: Home ===== */
    async function renderHomePage() {
        const container = document.getElementById('pageHome');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        const user = Auth.getCurrentUser();
        
        container.innerHTML = `
            <div class="page-content animate-fadeIn">
                <section class="hero stagger-children">
                    <span class="hero-badge" data-i18n="home.heroBadge">${I18n.t('home.heroBadge')}</span>
                    <h1 class="hero-title">${I18n.t('home.heroTitle1')}<br><span class="text-gradient">${I18n.t('home.heroTitle2')}</span></h1>
                    <p class="hero-subtitle">${I18n.t('home.heroSubtitle')}</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary btn-lg" id="homeStartBtn">
                            <span data-i18n="home.startChallenge">${I18n.t('home.startChallenge')}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="btn btn-secondary btn-lg btn-about-highlight" id="homeAboutBtn" data-page="about">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4M12 8h.01"/>
                            </svg>
                            <span data-i18n="home.aboutGuide">${I18n.t('home.aboutGuide')}</span>
                        </button>
                    </div>
                </section>

                <!-- Statistics grid -->
                <div class="stats-grid">
                    <div class="stat-card glass-card">
                        <div class="stat-icon cyan">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </div>
                        <div class="stat-number" id="statChallenges">0</div>
                        <div class="stat-label" data-i18n="stats.challenges">${I18n.t('stats.challenges')}</div>
                    </div>
                    <div class="stat-card glass-card">
                        <div class="stat-icon purple">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                        </div>
                        <div class="stat-number" id="statSkills">4</div>
                        <div class="stat-label" data-i18n="stats.skills">${I18n.t('stats.skills')}</div>
                    </div>
                    <div class="stat-card glass-card">
                        <div class="stat-icon gold">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div class="stat-number" id="statPerspectives">3+</div>
                        <div class="stat-label" data-i18n="stats.perspectives">${I18n.t('stats.perspectives')}</div>
                    </div>
                    <div class="stat-card glass-card">
                        <div class="stat-icon emerald">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                            </svg>
                        </div>
                        <div class="stat-number" id="statPhases">4</div>
                        <div class="stat-label" data-i18n="stats.methodology">${I18n.t('stats.methodology')}</div>
                    </div>
                </div>

                <!-- Methodology Section -->
                <section class="section">
                    <div class="section-header">
                        <span class="section-badge">✨ ${I18n.t('method.title')}</span>
                        <h2 class="section-title">${I18n.t('method.title')}</h2>
                        <p class="section-subtitle">${I18n.t('method.subtitle')}</p>
                    </div>
                    <div class="methodology-grid">
                        <div class="method-card glass-card">
                            <div class="method-number">1</div>
                            <div class="method-icon" style="color: var(--accent-cyan);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                </svg>
                            </div>
                            <h3 class="method-title">${I18n.t('method.challenge')}</h3>
                            <p class="method-desc">${I18n.t('method.challengeDesc')}</p>
                        </div>
                        <div class="method-card glass-card">
                            <div class="method-number">2</div>
                            <div class="method-icon" style="color: var(--accent-purple);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <h3 class="method-title">${I18n.t('method.interact')}</h3>
                            <p class="method-desc">${I18n.t('method.interactDesc')}</p>
                        </div>
                        <div class="method-card glass-card">
                            <div class="method-number">3</div>
                            <div class="method-icon" style="color: var(--accent-gold);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20h9"/>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                            </div>
                            <h3 class="method-title">${I18n.t('method.reflect')}</h3>
                            <p class="method-desc">${I18n.t('method.reflectDesc')}</p>
                        </div>
                        <div class="method-card glass-card">
                            <div class="method-number">4</div>
                            <div class="method-icon" style="color: var(--accent-emerald);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <h3 class="method-title">${I18n.t('method.evaluate')}</h3>
                            <p class="method-desc">${I18n.t('method.evaluateDesc')}</p>
                        </div>
                    </div>
                </section>

                <!-- UNESCO SDG 4 Alignment -->
                <section class="section" style="margin-top: var(--space-3xl); margin-bottom: var(--space-2xl);">
                    <div class="section-header">
                        <p class="section-subtitle section-subtitle-large">${I18n.t('unesco.subtitle')}</p>
                    </div>
                    <div class="unesco-grid">
                        <div class="unesco-item glass-card">
                            <div class="unesco-icon" style="background: rgba(0, 212, 255, 0.1); color: var(--accent-cyan);">🛡️</div>
                            <div class="unesco-text">
                                <h4>${I18n.t('unesco.ethical')}</h4>
                                <p>${I18n.t('unesco.ethicalDesc')}</p>
                            </div>
                        </div>
                        <div class="unesco-item glass-card">
                            <div class="unesco-icon" style="background: rgba(124, 58, 237, 0.1); color: var(--accent-purple);">📘</div>
                            <div class="unesco-text">
                                <h4>${I18n.t('unesco.sdg4')}</h4>
                                <p>${I18n.t('unesco.sdg4Desc')}</p>
                            </div>
                        </div>
                        <div class="unesco-item glass-card">
                            <div class="unesco-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-gold);">💡</div>
                            <div class="unesco-text">
                                <h4>${I18n.t('unesco.creativity')}</h4>
                                <p>${I18n.t('unesco.creativityDesc')}</p>
                            </div>
                        </div>
                        <div class="unesco-item glass-card">
                            <div class="unesco-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald);">🧘</div>
                            <div class="unesco-text">
                                <h4>${I18n.t('unesco.humanCentered')}</h4>
                                <p>${I18n.t('unesco.humanCenteredDesc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- About & User Guide Spotlight Banner -->
                <section class="section about-spotlight-section">
                    <div class="about-spotlight-card glass-card">
                        <div class="about-spotlight-content">
                            <span class="section-badge">✨ ${isAr ? 'عن المشروع ودليل الاستخدام' : 'About & User Guide'}</span>
                            <h3 class="about-spotlight-title">${I18n.t('home.aboutBannerTitle')}</h3>
                            <p class="about-spotlight-desc">${I18n.t('home.aboutBannerDesc')}</p>
                        </div>
                        <div class="about-spotlight-action">
                            <button type="button" class="btn btn-primary btn-lg glow-btn" id="bannerAboutBtn">
                                <span>${I18n.t('home.aboutBannerBtn')}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;

        // Home elements hooks
        document.getElementById('homeStartBtn').addEventListener('click', () => navigateTo('challenges'));
        
        const homeAboutBtn = document.getElementById('homeAboutBtn');
        if (homeAboutBtn) {
            homeAboutBtn.addEventListener('click', () => navigateTo('about'));
        }

        const bannerAboutBtn = document.getElementById('bannerAboutBtn');
        if (bannerAboutBtn) {
            bannerAboutBtn.addEventListener('click', () => navigateTo('about'));
        }

        // Load statistics count
        const total = (await Challenges.getAll()).length;
        animateCounter('statChallenges', total);
    }

    /* ===== Render Page: About & User Guide ===== */
    function renderAboutPage() {
        const container = document.getElementById('pageAbout');
        if (!container) return;
        AboutModule.render(container, I18n.getLang());
    }

    /**
     * Animate numeric counters in views
     */
    function animateCounter(id, maxVal) {
        const el = document.getElementById(id);
        if (!el) return;
        let count = 0;
        const duration = 1000;
        const step = Math.max(1, Math.floor(maxVal / (duration / 16)));
        const timer = setInterval(() => {
            count += step;
            if (count >= maxVal) {
                el.textContent = maxVal;
                clearInterval(timer);
            } else {
                el.textContent = count;
            }
        }, 16);
    }

    /* ===== Render Page: Challenges ===== */
    let currentFilterCategory = 'all';
    let currentFilterDifficulty = 'all';
    let searchQuery = '';

    async function renderChallengesPage() {
        const container = document.getElementById('pageChallenges');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';

        container.innerHTML = `
            <div class="page-content animate-fadeIn">
                <div class="section-header">
                    <span class="section-badge">🎯 ${I18n.t('challenges.title')}</span>
                    <h2 class="section-title">${I18n.t('challenges.title')}</h2>
                    <p class="section-subtitle">${I18n.t('challenges.subtitle')}</p>
                </div>

                <!-- Filters and Search Toolbar -->
                <div class="glass-card" style="padding: var(--space-lg); margin-bottom: var(--space-xl); border-radius: var(--radius-md);">
                    <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: center; justify-content: space-between;">
                        
                        <!-- Search Box -->
                        <div class="input-wrapper" style="min-width: 280px; flex: 1;">
                            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input type="text" id="challengeSearch" placeholder="${isAr ? 'ابحث عن تحدي...' : 'Search challenges...'}" value="${searchQuery}">
                        </div>

                        <!-- Category Filters -->
                        <div class="filter-bar" style="margin-bottom: 0;">
                            <button class="filter-chip ${currentFilterCategory === 'all' ? 'active' : ''}" data-category="all">${I18n.t('challenges.all')}</button>
                            <button class="filter-chip ${currentFilterCategory === 'science' ? 'active' : ''}" data-category="science">${I18n.t('challenges.science')}</button>
                            <button class="filter-chip ${currentFilterCategory === 'ethics' ? 'active' : ''}" data-category="ethics">${I18n.t('challenges.ethics')}</button>
                            <button class="filter-chip ${currentFilterCategory === 'technology' ? 'active' : ''}" data-category="technology">${I18n.t('challenges.technology')}</button>
                            <button class="filter-chip ${currentFilterCategory === 'society' ? 'active' : ''}" data-category="society">${I18n.t('challenges.society')}</button>
                            <button class="filter-chip ${currentFilterCategory === 'environment' ? 'active' : ''}" data-category="environment">${I18n.t('challenges.environment')}</button>
                        </div>

                        <!-- Difficulty Selector -->
                        <div class="input-wrapper" style="min-width: 150px;">
                            <select id="difficultySelect">
                                <option value="all" ${currentFilterDifficulty === 'all' ? 'selected' : ''}>${isAr ? 'كل المستويات' : 'All Levels'}</option>
                                <option value="beginner" ${currentFilterDifficulty === 'beginner' ? 'selected' : ''}>${I18n.t('challenges.beginner')}</option>
                                <option value="intermediate" ${currentFilterDifficulty === 'intermediate' ? 'selected' : ''}>${I18n.t('challenges.intermediate')}</option>
                                <option value="advanced" ${currentFilterDifficulty === 'advanced' ? 'selected' : ''}>${I18n.t('challenges.advanced')}</option>
                            </select>
                        </div>

                    </div>
                </div>

                <!-- Challenges Cards Grid -->
                <div class="challenges-grid" id="challengesGrid">
                    <div class="skeleton skeleton-text" style="height: 150px; grid-column: 1 / -1;"></div>
                </div>
            </div>
        `;

        // Event hooks
        document.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilterCategory = btn.getAttribute('data-category');
                filterAndRenderChallenges();
            });
        });

        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            currentFilterDifficulty = e.target.value;
            filterAndRenderChallenges();
        });

        const searchInput = document.getElementById('challengeSearch');
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterAndRenderChallenges();
        });

        filterAndRenderChallenges();
    }

    /**
     * Filter dynamically and populate challenges grid
     */
    async function filterAndRenderChallenges() {
        const grid = document.getElementById('challengesGrid');
        if (!grid) return;

        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        const allChallenges = await Challenges.getAll();

        const filtered = allChallenges.filter(c => {
            const matchesCategory = currentFilterCategory === 'all' || c.category === currentFilterCategory;
            const matchesDifficulty = currentFilterDifficulty === 'all' || c.difficulty === currentFilterDifficulty;
            
            const title = isAr ? c.titleAr : c.titleEn;
            const desc = isAr ? c.descAr : c.descEn;
            const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  desc.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesDifficulty && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <h3>${isAr ? 'لم يتم العثور على تحديات' : 'No challenges found'}</h3>
                    <p>${isAr ? 'يرجى تغيير خيارات البحث أو الفلترة' : 'Try modifying your search or filter parameters'}</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(c => {
            const title = isAr ? c.titleAr : c.titleEn;
            const desc = isAr ? c.descAr : c.descEn;
            
            // Difficulty visual indicator dot levels
            const dotActive = '<span class="difficulty-dot active"></span>';
            const dotInactive = '<span class="difficulty-dot"></span>';
            let diffIndicator = '';
            if (c.difficulty === 'beginner') diffIndicator = dotActive + dotInactive + dotInactive;
            else if (c.difficulty === 'intermediate') diffIndicator = dotActive + dotActive + dotInactive;
            else diffIndicator = dotActive + dotActive + dotActive;

            const categoryName = I18n.t(`challenges.${c.category}`);

            return `
                <div class="challenge-card glass-card animate-fadeIn" data-id="${c.id}">
                    <div class="challenge-category ${c.category}">${categoryName}</div>
                    <h3 class="challenge-title">${title}</h3>
                    <p class="challenge-desc">${desc}</p>
                    <div class="challenge-meta">
                        <div class="challenge-difficulty">
                            <span>${I18n.t(`challenges.${c.difficulty}`)}</span>
                            <div style="display: inline-flex; gap: 3px; margin-right: 6px;">${diffIndicator}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Card clicks open detailed session
        grid.querySelectorAll('.challenge-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                startChallengeSession(id);
            });
        });
    }

    /* ===== Render Page: Challenge Session (4 Phases) ===== */
    async function startChallengeSession(challengeId) {
        const challenge = await Challenges.getById(challengeId);
        if (!challenge) {
            showToast('general.error', 'error');
            return;
        }

        // Check if API key is set before starting. If not, alert and block student, except if role is teacher who can update settings.
        const settings = await AIEngine.getSettings();
        if (!settings.apiKey && !Auth.isTeacher()) {
            showToast('general.noApiKey', 'error');
            navigateTo('home');
            return;
        }

        activeChallenge = challenge;

        // Initialize session state
        currentSession = {
            challengeId: challenge.id,
            userId: Auth.getCurrentUser().id,
            phase: 1, // 1: Presentation, 2: Chat, 3: Reflection, 4: Evaluation
            chatHistory: [], // Structure: { role: 'user'|'model', text: '...' }
            reflection: '',
            evaluation: null,
            startedAt: new Date().toISOString(),
            completedAt: null
        };

        navigateTo('session');
        renderSessionPhase();
    }

    /**
     * Render the active phase in SPA Session Screen
     */
    function renderSessionPhase() {
        const container = document.getElementById('pageSession');
        if (!container) return;

        const phase = currentSession.phase;
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        const title = isAr ? activeChallenge.titleAr : activeChallenge.titleEn;
        
        container.innerHTML = `
            <div class="page-content animate-fadeIn">
                
                <!-- Phase stepper indicator -->
                <div class="phase-stepper">
                    <div class="phase-step ${phase >= 1 ? 'completed' : ''} ${phase === 1 ? 'active' : ''}">
                        <div class="phase-dot">1</div>
                        <span class="phase-label" data-i18n="session.phase1">${I18n.t('session.phase1')}</span>
                    </div>
                    <div class="phase-connector ${phase >= 2 ? 'completed' : ''}"></div>
                    <div class="phase-step ${phase >= 2 ? 'completed' : ''} ${phase === 2 ? 'active' : ''}">
                        <div class="phase-dot">2</div>
                        <span class="phase-label" data-i18n="session.phase2">${I18n.t('session.phase2')}</span>
                    </div>
                    <div class="phase-connector ${phase >= 3 ? 'completed' : ''}"></div>
                    <div class="phase-step ${phase >= 3 ? 'completed' : ''} ${phase === 3 ? 'active' : ''}">
                        <div class="phase-dot">3</div>
                        <span class="phase-label" data-i18n="session.phase3">${I18n.t('session.phase3')}</span>
                    </div>
                    <div class="phase-connector ${phase >= 4 ? 'completed' : ''}"></div>
                    <div class="phase-step ${phase >= 4 ? 'completed' : ''} ${phase === 4 ? 'active' : ''}">
                        <div class="phase-dot">4</div>
                        <span class="phase-label" data-i18n="session.phase4">${I18n.t('session.phase4')}</span>
                    </div>
                </div>

                <div style="max-width: 900px; margin: 0 auto 20px auto; text-align: center;">
                    <h2 class="text-gradient">${title}</h2>
                </div>

                <!-- Active Area Wrapper -->
                <div id="phaseContainer" class="animate-fadeIn"></div>

                <!-- Navigation Controls -->
                <div style="max-width: 900px; margin: 30px auto; display: flex; justify-content: space-between;">
                    <button class="btn btn-secondary" id="prevPhaseBtn" ${phase === 1 || phase === 4 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform: scaleX(1) !important;">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        <span data-i18n="session.prevPhase">${I18n.t('session.prevPhase')}</span>
                    </button>
                    
                    ${phase < 3 ? `
                        <button class="btn btn-primary" id="nextPhaseBtn">
                            <span data-i18n="session.nextPhase">${I18n.t('session.nextPhase')}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    ` : ''}
                    
                    ${phase === 3 ? `
                        <button class="btn btn-gold" id="finishPhaseBtn">
                            <span data-i18n="session.finish">${I18n.t('session.finish')}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Attach Nav Button Listeners
        const prevBtn = document.getElementById('prevPhaseBtn');
        const nextBtn = document.getElementById('nextPhaseBtn');
        const finishBtn = document.getElementById('finishPhaseBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSession.phase > 1) {
                    currentSession.phase--;
                    renderSessionPhase();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSession.phase < 4) {
                    // Save step logic
                    if (currentSession.phase === 1) {
                        // Moving to Chat, pre-populate introductory greeting if chat is empty
                        if (currentSession.chatHistory.length === 0) {
                            sendAIGreeting();
                        }
                    }
                    currentSession.phase++;
                    renderSessionPhase();
                }
            });
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                submitReflectionForEvaluation();
            });
        }

        // Draw the specific phase UI
        if (phase === 1) renderPhase1();
        if (phase === 2) renderPhase2();
        if (phase === 3) renderPhase3();
        if (phase === 4) renderPhase4();
    }

    /* ===== Phase 1: Challenge Presentation ===== */
    function renderPhase1() {
        const wrapper = document.getElementById('phaseContainer');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        
        const desc = isAr ? activeChallenge.descAr : activeChallenge.descEn;
        const questions = isAr ? activeChallenge.questionsAr : activeChallenge.questionsEn;

        wrapper.innerHTML = `
            <div class="glass-card" style="padding: var(--space-2xl); max-width: 900px; margin: 0 auto;">
                <div style="margin-bottom: var(--space-xl); line-height: 1.8; font-size: 1.1rem; color: var(--text-primary);">
                    ${desc}
                </div>
                
                <h3 style="margin-bottom: var(--space-md); font-size: 1.15rem; color: var(--accent-cyan); display: flex; align-items: center; gap: 8px;">
                    💡 <span data-i18n="reflection.tips">${I18n.t('reflection.tips')}</span>
                </h3>
                <ul class="eval-list" style="margin-bottom: var(--space-lg);">
                    ${questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    /* ===== Phase 2: Socratic Chat Interaction ===== */
    function renderPhase2() {
        const wrapper = document.getElementById('phaseContainer');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';

        wrapper.innerHTML = `
            <div class="glass-card chat-container">
                <div class="chat-messages" id="chatMessages"></div>
                
                <!-- Typing bubble loading state -->
                <div class="chat-typing hidden" id="chatTyping">
                    <span class="chat-bubble ai" style="display: inline-flex; align-items: center; gap: 4px; padding: 10px 15px;">
                        <span style="width:6px; height:6px; background:#00d4ff; border-radius:50%; animation:typingBounce 1.4s infinite;"></span>
                        <span style="width:6px; height:6px; background:#00d4ff; border-radius:50%; animation:typingBounce 1.4s infinite; animation-delay:0.2s;"></span>
                        <span style="width:6px; height:6px; background:#00d4ff; border-radius:50%; animation:typingBounce 1.4s infinite; animation-delay:0.4s;"></span>
                    </span>
                </div>

                <!-- Helper Socratic Prompt Buttons -->
                <div class="chat-helper-btns">
                    <button class="btn btn-secondary btn-sm" id="btnHelperView">${I18n.t('session.differentView')}</button>
                    <button class="btn btn-secondary btn-sm" id="btnHelperChallenge">${I18n.t('session.challengeMe')}</button>
                    <button class="btn btn-secondary btn-sm" id="btnHelperEvidence">${I18n.t('session.evidence')}</button>
                </div>

                <!-- Message Form Input Area -->
                <form class="chat-input-area" id="chatForm">
                    <textarea id="chatInput" placeholder="${I18n.t('session.sendMessage')}" required></textarea>
                    <button type="submit" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    </button>
                </form>
            </div>
        `;

        // Render existing dialogue messages
        const msgsContainer = document.getElementById('chatMessages');
        currentSession.chatHistory.forEach(msg => {
            appendMessage(msg.role, msg.text, false);
        });
        scrollToChatBottom();

        // Chat send trigger
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');

        // Prevent Enter newline from submitting directly unless Shift key is pressed
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.requestSubmit();
            }
        });

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            chatInput.value = '';
            appendMessage('user', text);
            currentSession.chatHistory.push({ role: 'user', text });

            // Call API
            await sendToAI(text);
        });

        // Setup Helper buttons callbacks
        document.getElementById('btnHelperView').addEventListener('click', () => {
            const prompt = isAr ? 'أعطني وجهة نظر مختلفة أو زاوية أخرى للنظر في هذا التحدي.' : 'Give me a different perspective or another angle to look at this challenge.';
            chatInput.value = prompt;
            chatInput.focus();
        });

        document.getElementById('btnHelperChallenge').addEventListener('click', () => {
            const prompt = isAr ? 'تحدّ موقفي واطرح رأياً معارضاً لنقاشه.' : 'Challenge my stance and present a counter-argument for discussion.';
            chatInput.value = prompt;
            chatInput.focus();
        });

        document.getElementById('btnHelperEvidence').addEventListener('click', () => {
            const prompt = isAr ? 'ما هي الأدلة أو الدراسات التي تدعم أو تفند هذا الرأي؟' : 'What evidence or studies support or debunk this opinion?';
            chatInput.value = prompt;
            chatInput.focus();
        });
    }

    /**
     * Show initial Socratic greet from AI Engine
     */
    async function sendAIGreeting() {
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        const user = Auth.getCurrentUser();
        
        const greet = isAr 
            ? `مرحباً بك يا ${user.displayName} في هذا التحدي الفكري. بعد قراءة وصف التحدي، ما هو رأيك الأولي أو انطباعك بخصوص هذه القضية؟ كيف ترى حلها؟`
            : `Welcome ${user.displayName} to this intellectual challenge. After reading the description, what is your initial stance or impression on this issue? How do you see it?`;

        currentSession.chatHistory.push({ role: 'model', text: greet });
    }

    /**
     * Send message payload to AI Engine
     */
    async function sendToAI(userText) {
        const typing = document.getElementById('chatTyping');
        if (typing) typing.classList.remove('hidden');
        scrollToChatBottom();

        try {
            const reply = await AIEngine.sendMessage(
                activeChallenge,
                currentSession.chatHistory.slice(0, -1), // Send previous history without the newly added last user message
                userText,
                I18n.getLang()
            );

            if (typing) typing.classList.add('hidden');
            
            appendMessage('model', reply);
            currentSession.chatHistory.push({ role: 'model', text: reply });

        } catch (error) {
            console.error(error);
            if (typing) typing.classList.add('hidden');
            
            const isAr = I18n.getLang() === 'ar';
            if (error.message === 'general.noApiKey') {
                appendMessage('model', I18n.t('general.noApiKey'));
            } else {
                const detailedError = isAr 
                    ? `حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي: ${error.message || 'خطأ غير معروف'}`
                    : `An error occurred while connecting to AI engine: ${error.message || 'Unknown error'}`;
                appendMessage('model', detailedError);
            }
        }
    }

    /**
     * Helper to append message bubbles dynamically
     */
    function appendMessage(role, text, animate = true) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role}`;
        if (!animate) bubble.style.animation = 'none';

        const senderLabel = role === 'user' ? I18n.t('session.you') : I18n.t('session.aiPartner');

        // Simple markdown parsing for lists and code blocks in replies
        let formattedText = text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        bubble.innerHTML = `
            <div class="sender">${senderLabel}</div>
            <div class="content">${formattedText}</div>
        `;

        container.appendChild(bubble);
        scrollToChatBottom();
    }

    function scrollToChatBottom() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /* ===== Phase 3: Reflection Area ===== */
    function renderPhase3() {
        const wrapper = document.getElementById('phaseContainer');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';

        wrapper.innerHTML = `
            <div class="glass-card reflection-area animate-fadeIn">
                <h3 style="margin-bottom: var(--space-sm); font-size: 1.25rem;">${I18n.t('reflection.title')}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: var(--space-lg);">${I18n.t('reflection.prompt')}</p>

                <!-- Thinking Depth Indicator Bar -->
                <div class="thinking-meter">
                    <div class="thinking-meter-label">
                        <span data-i18n="reflection.depth">${I18n.t('reflection.depth')}</span>
                        <span id="depthLabel">${isAr ? 'سطحي' : 'Superficial'}</span>
                    </div>
                    <div class="thinking-meter-bar">
                        <div class="thinking-meter-fill" id="depthFill" style="width: 10%;"></div>
                    </div>
                </div>

                <div class="form-group" style="position: relative;">
                    <textarea class="reflection-textarea" id="reflectionText" placeholder="${I18n.t('reflection.placeholder')}" required>${currentSession.reflection}</textarea>
                    <div style="position: absolute; bottom: 10px; left: 10px; font-size: 0.8rem; color: var(--text-tertiary);" id="wordCountLabel">
                        ${I18n.t('reflection.wordCount')}: <span id="wordCount">0</span>
                    </div>
                </div>

                <div class="glass-card" style="padding: var(--space-md); border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.02);">
                    <h4 style="color: var(--accent-gold); font-size: 0.95rem; margin-bottom: var(--space-xs); display: flex; align-items: center; gap: 6px;">
                        📌 <span data-i18n="reflection.tips">${I18n.t('reflection.tips')}</span>
                    </h4>
                    <ul class="eval-list" style="font-size: 0.85rem;">
                        <li data-i18n="reflection.tip1">${I18n.t('reflection.tip1')}</li>
                        <li data-i18n="reflection.tip2">${I18n.t('reflection.tip2')}</li>
                        <li data-i18n="reflection.tip3">${I18n.t('reflection.tip3')}</li>
                        <li data-i18n="reflection.tip4">${I18n.t('reflection.tip4')}</li>
                    </ul>
                </div>
            </div>
        `;

        const textarea = document.getElementById('reflectionText');
        const wordCountSpan = document.getElementById('wordCount');
        const depthFill = document.getElementById('depthFill');
        const depthLabel = document.getElementById('depthLabel');

        // Initialize values if returning
        updateReflectionMeter(textarea.value);

        textarea.addEventListener('input', () => {
            currentSession.reflection = textarea.value;
            updateReflectionMeter(textarea.value);
        });

        function updateReflectionMeter(val) {
            const words = val.trim() === '' ? 0 : val.trim().split(/\s+/).length;
            wordCountSpan.textContent = words;

            // Compute depth based on words count and punctuation markers
            let percent = Math.min(100, Math.floor((words / 150) * 100));
            if (words > 0 && percent < 10) percent = 10;

            depthFill.style.width = `${percent}%`;

            let label = isAr ? 'سطحي' : 'Superficial';
            if (percent > 80) label = isAr ? 'عميق جداً ودقيق' : 'Deep & Comprehensive';
            else if (percent > 50) label = isAr ? 'متوسط ومتوازن' : 'Moderate & Balanced';
            else if (percent > 25) label = isAr ? 'مقبول' : 'Basic';

            depthLabel.textContent = label;
        }
    }

    /**
     * Submit reflection output to AI Engine for structured JSON Evaluation
     */
    async function submitReflectionForEvaluation() {
        const txt = currentSession.reflection.trim();
        if (txt.length < 10) {
            showToast('general.error', 'error');
            return;
        }

        // Change view to loading evaluation screen
        const wrapper = document.getElementById('phaseContainer');
        const isAr = I18n.getLang() === 'ar';
        
        wrapper.innerHTML = `
            <div class="glass-card text-center animate-fadeIn" style="padding: var(--space-3xl); max-width: 900px; margin: 0 auto;">
                <div class="chat-typing" style="justify-content: center; margin-bottom: var(--space-lg);">
                    <span></span><span></span><span></span>
                </div>
                <h3 style="margin-bottom: 10px;">${isAr ? 'جاري تحليل وتقييم إجاباتك...' : 'Analyzing and evaluating your reflection...'}</h3>
                <p style="color: var(--text-secondary);">${isAr ? 'يقوم محرك الذكاء الاصطناعي بدراسة حججك وبناء التقرير التفصيلي' : 'Our AI engine is assessing your Socratic arguments and generating the report'}</p>
            </div>
        `;

        // Hide navigation control buttons during evaluation to prevent interruption
        document.getElementById('prevPhaseBtn').disabled = true;
        const finishBtn = document.getElementById('finishPhaseBtn');
        if (finishBtn) finishBtn.remove();

        try {
            const report = await AIEngine.evaluate(
                activeChallenge,
                currentSession.chatHistory,
                txt,
                I18n.getLang()
            );

            // Populate and save session output
            currentSession.evaluation = report;
            currentSession.completedAt = new Date().toISOString();
            currentSession.phase = 4;

            // Save in Database
            await db.sessions.add(currentSession);

            renderSessionPhase();
            showToast('general.success', 'success');

        } catch (e) {
            console.error('Evaluation Error Details:', e);
            
            // Show a more descriptive error message
            const isAr = I18n.getLang() === 'ar';
            let errorMsg = '';
            let rawPreview = '';
            
            if (e.message && e.message.startsWith('PARSE_FAIL::')) {
                rawPreview = e.message.replace('PARSE_FAIL::', '');
                errorMsg = isAr ? 'تعذّر تحليل استجابة الذكاء الاصطناعي. الاستجابة الخام معروضة أدناه.' : 'Could not parse AI response. Raw response shown below.';
            } else if (e.message && e.message.includes('not found')) {
                errorMsg = isAr ? 'النموذج المحدد غير موجود. يرجى تغيير النموذج من الإعدادات.' : 'Selected AI model not found. Please change the model in Settings.';
            } else if (e.message && e.message.includes('API key')) {
                errorMsg = isAr ? 'مفتاح API غير صالح. يرجى التحقق من الإعدادات.' : 'Invalid API key. Please check Settings.';
            } else if (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) {
                errorMsg = isAr ? 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.' : 'Network error. Please check your internet connection.';
            } else {
                errorMsg = isAr ? `حدث خطأ أثناء التقييم: ${e.message || 'خطأ غير معروف'}` : `Evaluation error: ${e.message || 'Unknown error'}`;
            }
            
            // Show error inline so user understands what happened
            const wrapper = document.getElementById('phaseContainer');
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="glass-card text-center animate-fadeIn" style="padding: var(--space-3xl); max-width: 900px; margin: 0 auto;">
                        <div style="font-size: 3rem; margin-bottom: var(--space-md);">⚠️</div>
                        <h3 style="margin-bottom: var(--space-md); color: var(--accent-gold);">${isAr ? 'تعذّر إتمام التقييم' : 'Evaluation Failed'}</h3>
                        <p style="color: var(--text-secondary); margin-bottom: var(--space-lg); line-height: 1.7;">${errorMsg}</p>
                        ${rawPreview ? `
                            <div style="text-align: left; direction: ltr; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-lg); max-height: 200px; overflow-y: auto;">
                                <code style="font-size: 0.8rem; color: var(--accent-gold); white-space: pre-wrap; word-break: break-all;">${rawPreview}</code>
                            </div>
                        ` : ''}
                        <button class="btn btn-primary" id="retryReflectionBtn">${isAr ? 'العودة والمحاولة مجدداً' : 'Go Back & Retry'}</button>
                    </div>
                `;
                document.getElementById('retryReflectionBtn').addEventListener('click', () => {
                    currentSession.phase = 3;
                    renderSessionPhase();
                });
            } else {
                showToast('general.error', 'error');
                currentSession.phase = 3;
                renderSessionPhase();
            }
        }
    }

    /* ===== Phase 4: Socratic Evaluation Report View ===== */
    function renderPhase4() {
        const wrapper = document.getElementById('phaseContainer');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        const ev = currentSession.evaluation;

        wrapper.innerHTML = `
            <div class="glass-card eval-results animate-fadeIn">
                <div class="text-center" style="margin-bottom: var(--space-2xl);">
                    <span class="section-badge">📊 ${I18n.t('eval.title')}</span>
                    <h2>${isAr ? 'تقرير التقييم النهائي' : 'Final Evaluation Report'}</h2>
                </div>

                <!-- Scores cards -->
                <div class="eval-scores">
                    <div class="glass-card eval-score-card">
                        <div class="eval-score-value text-gradient" style="font-size: 3rem;">${ev.overall || 0}</div>
                        <div class="eval-score-label" data-i18n="eval.overall">${I18n.t('eval.overall')}</div>
                    </div>
                    
                    <div class="glass-card" style="padding: var(--space-lg);">
                        <canvas id="evalRadarCanvas"></canvas>
                    </div>
                </div>

                <!-- Detailed Skill Metrics -->
                <div class="glass-card" style="padding: var(--space-xl); margin-bottom: var(--space-xl);">
                    <h3 style="margin-bottom: var(--space-md); font-size: 1.15rem; color: var(--accent-cyan);">📚 ${I18n.t('eval.feedback')}</h3>
                    <p style="line-height: 1.8; color: var(--text-primary);">${ev.feedback || ''}</p>
                </div>

                <!-- Strengths and Improvements lists -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); margin-bottom: var(--space-2xl);">
                    <div class="glass-card" style="padding: var(--space-xl); border-color: rgba(16, 185, 129, 0.2);">
                        <h3 style="margin-bottom: var(--space-md); font-size: 1.1rem; color: var(--accent-emerald);">✔️ ${I18n.t('eval.strengths')}</h3>
                        <ul class="eval-list">
                            ${ev.strengths?.map(s => `<li>${s}</li>`).join('') || ''}
                        </ul>
                    </div>
                    <div class="glass-card" style="padding: var(--space-xl); border-color: rgba(245, 158, 11, 0.2);">
                        <h3 style="margin-bottom: var(--space-md); font-size: 1.1rem; color: var(--accent-gold);">⚡ ${I18n.t('eval.improvements')}</h3>
                        <ul class="eval-list">
                            ${ev.improvements?.map(imp => `<li>${imp}</li>`).join('') || ''}
                        </ul>
                    </div>
                </div>

                <div class="text-center" style="display: flex; gap: var(--space-md); justify-content: center;">
                    <button class="btn btn-primary" id="btnEvalTryAnother">${I18n.t('eval.tryAnother')}</button>
                    <button class="btn btn-secondary" id="btnEvalViewProfile">${I18n.t('eval.viewProfile')}</button>
                </div>
            </div>
        `;

        // Render Radar chart using Analytics module
        Analytics.renderRadarChart('evalRadarCanvas', ev, lang);

        // Buttons trigger
        document.getElementById('btnEvalTryAnother').addEventListener('click', () => navigateTo('challenges'));
        document.getElementById('btnEvalViewProfile').addEventListener('click', () => navigateTo('profile'));
    }

    /* ===== Render Page: Student Profile ===== */
    async function renderProfilePage() {
        const container = document.getElementById('pageProfile');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        const user = Auth.getCurrentUser();

        // Fetch completed sessions from DB
        const allSessions = await db.sessions.where('userId').equals(user.id).toArray();
        const completed = allSessions.filter(s => s.completedAt && s.evaluation);
        
        // Calculate scores and badges
        const allChallenges = await Challenges.getAll();
        const averages = Analytics.calculateAverages(completed);
        const earnedBadges = Analytics.checkBadges(completed, allChallenges);
        const allBadgesList = Analytics.getBadgesList();

        container.innerHTML = `
            <div class="page-content animate-fadeIn">
                <div class="section-header">
                    <span class="section-badge">👤 ${I18n.t('profile.title')}</span>
                    <h2>${user.displayName}</h2>
                    <p class="section-subtitle">${isAr ? 'لوحة تتبع المهارات والمكتسبات الشخصية' : 'Your personal skill acquisition & progress dashboard'}</p>
                </div>

                <!-- Metric counters cards -->
                <div class="stats-grid" style="margin-bottom: var(--space-xl);">
                    <div class="stat-card glass-card">
                        <div class="stat-number" style="font-size: 2.8rem;">${completed.length}</div>
                        <div class="stat-label">${I18n.t('profile.completedChallenges')}</div>
                    </div>
                    <div class="stat-card glass-card">
                        <div class="stat-number text-gradient" style="font-size: 2.8rem;">${averages.overall}%</div>
                        <div class="stat-label">${I18n.t('profile.avgScore')}</div>
                    </div>
                    <div class="stat-card glass-card">
                        <div class="stat-number" style="font-size: 2.8rem;">${earnedBadges.length}</div>
                        <div class="stat-label">${I18n.t('profile.badges')}</div>
                    </div>
                    <div class="stat-card glass-card">
                        <div class="stat-number" style="font-size: 2.8rem;">
                            ${completed.reduce((acc, s) => acc + (s.reflection?.split(/\s+/).length || 0), 0)}
                        </div>
                        <div class="stat-label">${I18n.t('profile.totalReflections')}</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 3fr; gap: var(--space-lg); margin-bottom: var(--space-xl);">
                    
                    <!-- Skill Radar distribution -->
                    <div class="glass-card" style="padding: var(--space-xl);">
                        <h3 style="margin-bottom: var(--space-md); font-size: 1.1rem; color: var(--accent-cyan);">${isAr ? 'توزيع المهارات التراكمي' : 'Cumulative Skill Map'}</h3>
                        <canvas id="profileRadarCanvas"></canvas>
                    </div>

                    <!-- Growth Curve Line chart -->
                    <div class="glass-card" style="padding: var(--space-xl);">
                        <h3 style="margin-bottom: var(--space-md); font-size: 1.1rem; color: var(--accent-purple);">${I18n.t('profile.growth')}</h3>
                        <canvas id="profileGrowthCanvas"></canvas>
                    </div>
                </div>

                <!-- Badges shelf -->
                <div class="glass-card" style="padding: var(--space-xl); margin-bottom: var(--space-xl);">
                    <h3 style="margin-bottom: var(--space-lg); font-size: 1.1rem; color: var(--accent-gold);">${I18n.t('profile.badges')}</h3>
                    <div class="badges-grid">
                        ${allBadgesList.map(b => {
                            const isEarned = earnedBadges.includes(b.id);
                            const name = isAr ? b.nameAr : b.nameEn;
                            const desc = isAr ? b.descAr : b.descEn;
                            return `
                                <div class="badge-item ${isEarned ? 'earned' : 'locked'}" title="${desc}">
                                    <div class="badge-icon">${b.icon}</div>
                                    <div class="badge-name">${name}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Sessions history table list -->
                <div class="glass-card" style="padding: var(--space-xl);">
                    <h3 style="margin-bottom: var(--space-lg); font-size: 1.1rem;">${I18n.t('profile.history')}</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: right;" id="historyTable">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 0.9rem;">
                                    <th style="padding: 12px;">${isAr ? 'التحدي' : 'Challenge'}</th>
                                    <th style="padding: 12px;">${isAr ? 'التاريخ' : 'Date'}</th>
                                    <th style="padding: 12px; text-align: center;">${isAr ? 'الدرجة الإجمالية' : 'Overall Score'}</th>
                                    <th style="padding: 12px; text-align: center;">${isAr ? 'الإجراء' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${completed.length === 0 ? `
                                    <tr>
                                        <td colspan="4" style="padding: 20px; text-align: center; color: var(--text-tertiary);">
                                            ${I18n.t('profile.noChallenges')}
                                        </td>
                                    </tr>
                                ` : completed.map((s, idx) => {
                                    const ch = allChallenges.find(c => String(c.id) === String(s.challengeId));
                                    const chTitle = ch ? (isAr ? ch.titleAr : ch.titleEn) : `Challenge #${s.challengeId}`;
                                    const date = new Date(s.completedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US');
                                    return `
                                        <tr style="border-bottom: 1px solid var(--border-subtle); font-size: 0.95rem;">
                                            <td style="padding: 15px;">${chTitle}</td>
                                            <td style="padding: 15px; color: var(--text-secondary);">${date}</td>
                                            <td style="padding: 15px; text-align: center; font-weight: 700; color: var(--accent-cyan);">${s.evaluation.overall}%</td>
                                            <td style="padding: 15px; text-align: center;">
                                                <button class="btn btn-secondary btn-sm btn-view-report" data-idx="${idx}">${isAr ? 'عرض التقرير' : 'View Report'}</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Render charts
        if (completed.length > 0) {
            Analytics.renderRadarChart('profileRadarCanvas', averages, lang);
            Analytics.renderGrowthChart('profileGrowthCanvas', completed, allChallenges, lang);
        }

        // Action view reports trigger
        container.querySelectorAll('.btn-view-report').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                activeChallenge = allChallenges.find(c => String(c.id) === String(completed[idx].challengeId));
                currentSession = completed[idx];
                navigateTo('session');
                currentSession.phase = 4;
                renderSessionPhase();
            });
        });
    }

    /* ===== Render Page: Teacher Dashboard ===== */
    async function renderDashboardPage() {
        const container = document.getElementById('pageDashboard');
        const lang = I18n.getLang();
        const isAr = lang === 'ar';
        
        // Fetch stats from DB
        const users = await db.users.where('role').equals('student').toArray();
        const sessions = await db.sessions.toArray();
        const completedSessions = sessions.filter(s => s.completedAt && s.evaluation);
        const allChallenges = await Challenges.getAll();
        
        const overallAvg = Analytics.calculateAverages(completedSessions).overall;

        container.innerHTML = `
            <div class="page-content animate-fadeIn">
                <div class="section-header">
                    <span class="section-badge">🏫 ${I18n.t('dashboard.title')}</span>
                    <h2>${I18n.t('dashboard.title')}</h2>
                    <p class="section-subtitle">${isAr ? 'لوحة تحكم إشرافية لمتابعة أداء وتفكير الطلاب وتعديل خيارات المنصة' : 'Supervisory panel to track student performance, review Socratic dialogue, and edit configuration settings'}</p>
                </div>

                <!-- Dashboard tabs selector -->
                <div class="filter-bar" style="justify-content: center; margin-bottom: var(--space-xl);">
                    <button class="filter-chip active" id="tabDashboardOverview">${I18n.t('dashboard.overview')}</button>
                    <button class="filter-chip" id="tabDashboardStudents">${I18n.t('dashboard.students')}</button>
                    <button class="filter-chip" id="tabDashboardSettings">${I18n.t('dashboard.settings')}</button>
                </div>

                <!-- Tab: Overview -->
                <div class="dashboard-tab" id="paneDashboardOverview">
                    <div class="stats-grid" style="margin-bottom: var(--space-xl);">
                        <div class="stat-card glass-card">
                            <div class="stat-number">${users.length}</div>
                            <div class="stat-label">${I18n.t('dashboard.totalStudents')}</div>
                        </div>
                        <div class="stat-card glass-card">
                            <div class="stat-number">${sessions.filter(s => !s.completedAt).length}</div>
                            <div class="stat-label">${I18n.t('dashboard.activeSessions')}</div>
                        </div>
                        <div class="stat-card glass-card">
                            <div class="stat-number text-gradient">${overallAvg}%</div>
                            <div class="stat-label">${I18n.t('dashboard.avgPerformance')}</div>
                        </div>
                        <div class="stat-card glass-card">
                            <div class="stat-number">${completedSessions.length}</div>
                            <div class="stat-label">${I18n.t('dashboard.totalSessions')}</div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 3fr 2fr; gap: var(--space-lg);">
                        <div class="glass-card" style="padding: var(--space-xl);">
                            <h3 style="margin-bottom: var(--space-md); font-size: 1.1rem;">${isAr ? 'متوسط الأداء حسب مجالات التحدي' : 'Avg Performance by Topic'}</h3>
                            <canvas id="dashboardPerformanceCanvas"></canvas>
                        </div>
                        
                        <!-- Recent sessions list -->
                        <div class="glass-card" style="padding: var(--space-xl); display: flex; flex-direction: column;">
                            <h3 style="margin-bottom: var(--space-md); font-size: 1.1rem;">${isAr ? 'أحدث الجلسات المكتملة' : 'Recent Completed Sessions'}</h3>
                            <div style="flex: 1; overflow-y: auto; max-height: 300px;">
                                ${completedSessions.length === 0 ? `
                                    <div style="padding: 20px; text-align: center; color: var(--text-tertiary);">${isAr ? 'لا يوجد نشاطات مسجلة بعد' : 'No recorded activity yet'}</div>
                                ` : completedSessions.slice(-5).reverse().map(s => {
                                    const student = users.find(u => u.id === s.userId);
                                    const challenge = allChallenges.find(c => String(c.id) === String(s.challengeId));
                                    const name = student ? student.displayName : `User #${s.userId}`;
                                    const title = challenge ? (isAr ? challenge.titleAr : challenge.titleEn) : `Challenge #${s.challengeId}`;
                                    return `
                                        <div style="padding: 10px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <div style="font-weight:600; font-size:0.9rem;">${name}</div>
                                                <div style="font-size:0.75rem; color:var(--text-secondary);">${title}</div>
                                            </div>
                                            <div style="font-weight:700; color:var(--accent-cyan); font-size:0.95rem;">${s.evaluation.overall}%</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Students List & Individual Performance Analysis -->
                <div class="dashboard-tab hidden" id="paneDashboardStudents">
                    <div style="display: grid; grid-template-columns: 2fr 3fr; gap: var(--space-lg);">
                        
                        <div class="glass-card" style="padding: var(--space-xl); max-height: 500px; overflow-y: auto;">
                            <h3 style="margin-bottom: var(--space-lg); font-size: 1.1rem;">${I18n.t('dashboard.studentProgress')}</h3>
                            <div class="student-list">
                                ${users.length === 0 ? `
                                    <div style="text-align: center; color: var(--text-tertiary); padding: 20px;">
                                        ${I18n.t('dashboard.noStudents')}
                                    </div>
                                ` : users.map(u => {
                                    const studSessions = completedSessions.filter(s => s.userId === u.id);
                                    const count = studSessions.length;
                                    const avg = count > 0 ? Math.round(studSessions.reduce((acc, s) => acc + (s.evaluation.overall || 0), 0) / count) : 0;
                                    return `
                                        <div class="student-item" data-id="${u.id}">
                                            <div class="student-avatar">${u.displayName.charAt(0).toUpperCase()}</div>
                                            <div class="student-info">
                                                <div class="student-name">${u.displayName}</div>
                                                <div class="student-stats">${isAr ? `تحديات مكتملة: ${count} | متوسط: ${avg}%` : `Completed: ${count} | Avg: ${avg}%`}</div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Detailed report view when clicking on a student -->
                        <div class="glass-card" style="padding: var(--space-xl);" id="studentDetailsPane">
                            <div style="text-align: center; color: var(--text-tertiary); padding: 50px;">
                                👤 ${isAr ? 'اختر طالباً من القائمة لعرض تفاصيل أدائه وتقارير تأمله وحواره السقراطي' : 'Select a student from the list to view performance mapping, reflection reviews, and dialogue logs'}
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Tab: Platform Settings & Custom Challenge creation -->
                <div class="dashboard-tab hidden" id="paneDashboardSettings">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
                        
                        <!-- Form Settings: API Keys -->
                        <div class="glass-card" style="padding: var(--space-xl);">
                            <h3 style="margin-bottom: var(--space-lg); font-size: 1.1rem; color: var(--accent-cyan);">⚙️ ${isAr ? 'إعدادات الاتصال بمحرك الذكاء الاصطناعي' : 'AI Engine Connection Settings'}</h3>
                            <form id="settingsForm">
                                <div class="form-group">
                                    <label for="setApiKey" data-i18n="dashboard.apiKey">${I18n.t('dashboard.apiKey')}</label>
                                    <div class="input-wrapper">
                                        <input type="password" id="setApiKey" placeholder="${I18n.t('dashboard.apiKeyPlaceholder')}">
                                    </div>
                                    <p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 5px;">
                                        ${isAr ? 'عند النشر مع api.ashx يتم حفظ المفتاح على السيرفر واستخدامه من هناك. عند فتح الموقع كملفات فقط يتم استخدام تخزين المتصفح المحلي.' : 'When deployed with api.ashx, the key is saved on the server and used from there. When opened as static files only, browser local storage is used.'}
                                    </p>
                                </div>
                                <div class="form-group">
                                    <label for="setModelSelect">${isAr ? 'نموذج الذكاء الاصطناعي (Model)' : 'AI Model Target'}</label>
                                    <div class="input-wrapper">
                                        <select id="setModelSelect">
                                             <option value="gpt-4o-mini">gpt-4o-mini (سريع وموصى به)</option>
                                             <option value="gpt-4o">gpt-4o (أعلى دقة)</option>
                                             <option value="gpt-5.2">gpt-5.2</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-full">${I18n.t('dashboard.saveSettings')}</button>
                            </form>
                        </div>

                        <!-- Form Create Custom Challenge -->
                        <div class="glass-card" style="padding: var(--space-xl);">
                            <h3 style="margin-bottom: var(--space-lg); font-size: 1.1rem; color: var(--accent-gold);">🆕 ${I18n.t('dashboard.addChallenge')}</h3>
                            <form id="addChallengeForm">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
                                    <div class="form-group">
                                        <label for="chCategory">${isAr ? 'المجال' : 'Topic Category'}</label>
                                        <div class="input-wrapper">
                                            <select id="chCategory">
                                                <option value="science">${I18n.t('challenges.science')}</option>
                                                <option value="ethics">${I18n.t('challenges.ethics')}</option>
                                                <option value="technology">${I18n.t('challenges.technology')}</option>
                                                <option value="society">${I18n.t('challenges.society')}</option>
                                                <option value="environment">${I18n.t('challenges.environment')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="chDifficulty">${isAr ? 'مستوى الصعوبة' : 'Difficulty'}</label>
                                        <div class="input-wrapper">
                                            <select id="chDifficulty">
                                                <option value="beginner">${I18n.t('challenges.beginner')}</option>
                                                <option value="intermediate">${I18n.t('challenges.intermediate')}</option>
                                                <option value="advanced">${I18n.t('challenges.advanced')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="chTitleAr">${isAr ? 'العنوان (بالعربية)' : 'Title (Arabic)'}</label>
                                    <div class="input-wrapper"><input type="text" id="chTitleAr" required></div>
                                </div>
                                <div class="form-group">
                                    <label for="chTitleEn">${isAr ? 'العنوان (بالإنجليزية)' : 'Title (English)'}</label>
                                    <div class="input-wrapper"><input type="text" id="chTitleEn" required></div>
                                </div>

                                <div class="form-group">
                                    <label for="chDescAr">${isAr ? 'الوصف التحدي (بالعربية)' : 'Description (Arabic)'}</label>
                                    <textarea id="chDescAr" style="min-height: 80px;" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="chDescEn">${isAr ? 'الوصف التحدي (بالإنجليزية)' : 'Description (English)'}</label>
                                    <textarea id="chDescEn" style="min-height: 80px;" required></textarea>
                                </div>

                                <button type="submit" class="btn btn-gold btn-full">${I18n.t('dashboard.addChallenge')}</button>
                            </form>
                        </div>

                    </div>

                    <!-- Manage Challenges Section -->
                    <div class="glass-card" style="padding: var(--space-xl); margin-top: var(--space-lg);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg);">
                            <h3 style="font-size: 1.1rem; color: var(--accent-rose);">🗑️ ${I18n.t('dashboard.manageChallenges')}</h3>
                            <span style="font-size: 0.8rem; color: var(--text-tertiary);">${isAr ? `${allChallenges.length} تحدي` : `${allChallenges.length} challenges`}</span>
                        </div>
                        <div id="manageChallengesList" style="display: flex; flex-direction: column; gap: var(--space-sm); max-height: 420px; overflow-y: auto; padding-left: 4px; padding-right: 4px;">
                            ${allChallenges.length === 0 ? `
                                <div style="text-align: center; color: var(--text-tertiary); padding: 30px;">
                                    ${isAr ? 'لا يوجد تحديات' : 'No challenges found'}
                                </div>
                            ` : allChallenges.map(c => {
                                const title = isAr ? c.titleAr : c.titleEn;
                                const desc = isAr ? c.descAr : c.descEn;
                                const categoryName = I18n.t(`challenges.${c.category}`);
                                const diffName = I18n.t(`challenges.${c.difficulty}`);
                                return `
                                    <div class="manage-challenge-item" data-challenge-id="${c.id}">
                                        <div style="display: flex; align-items: center; gap: var(--space-md); flex: 1; min-width: 0;">
                                            <div class="challenge-category-badge ${c.category}">${categoryName}</div>
                                            <div style="flex: 1; min-width: 0;">
                                                <div style="font-weight: 600; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                    ${title} ${c.isCustom ? '<span style="font-size:0.7rem; background:rgba(245,158,11,0.15); color:var(--accent-gold); padding:2px 6px; border-radius:4px; margin-inline-start:6px;">' + (isAr ? 'مخصص' : 'Custom') + '</span>' : ''}
                                                </div>
                                                <div style="font-size: 0.78rem; color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px;">${desc}</div>
                                            </div>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: var(--space-sm); flex-shrink: 0;">
                                            <span class="difficulty-badge ${c.difficulty}">${diffName}</span>
                                            <button class="btn-delete-challenge" data-id="${c.id}" title="${I18n.t('dashboard.deleteChallenge')}">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                </div>
            </div>
        `;

        // Load charts inside Overview Tab
        if (completedSessions.length > 0) {
            Analytics.renderDashboardBarChart('dashboardPerformanceCanvas', completedSessions, allChallenges, lang);
        }

        // Bind tabs navigation logic
        const tabOverview = document.getElementById('tabDashboardOverview');
        const tabStudents = document.getElementById('tabDashboardStudents');
        const tabSettings = document.getElementById('tabDashboardSettings');

        const paneOverview = document.getElementById('paneDashboardOverview');
        const paneStudents = document.getElementById('paneDashboardStudents');
        const paneSettings = document.getElementById('paneDashboardSettings');

        tabOverview.addEventListener('click', () => {
            tabOverview.classList.add('active'); tabStudents.classList.remove('active'); tabSettings.classList.remove('active');
            paneOverview.classList.remove('hidden'); paneStudents.classList.add('hidden'); paneSettings.classList.add('hidden');
        });

        tabStudents.addEventListener('click', () => {
            tabOverview.classList.remove('active'); tabStudents.classList.add('active'); tabSettings.classList.remove('active');
            paneOverview.classList.add('hidden'); paneStudents.classList.remove('hidden'); paneSettings.classList.add('hidden');
        });

        // Prefill Settings input fields immediately on dashboard load
        AIEngine.getSettings().then(dataSettings => {
            const keyEl = document.getElementById('setApiKey');
            const modelEl = document.getElementById('setModelSelect');
            if (keyEl && dataSettings.apiKey) keyEl.value = dataSettings.apiKey;
            if (modelEl && dataSettings.model) modelEl.value = dataSettings.model;
        }).catch(err => console.warn('Could not prefill settings:', err));

        tabSettings.addEventListener('click', async () => {
            tabOverview.classList.remove('active'); tabStudents.classList.remove('active'); tabSettings.classList.add('active');
            paneOverview.classList.add('hidden'); paneStudents.classList.add('hidden'); paneSettings.classList.remove('hidden');

            // Prefill Settings input fields
            const dataSettings = await AIEngine.getSettings();
            document.getElementById('setApiKey').value = dataSettings.apiKey;
            document.getElementById('setModelSelect').value = dataSettings.model;
        });

        // Handle Save API Keys settings form
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const valKey = document.getElementById('setApiKey').value.trim();
            const valModel = document.getElementById('setModelSelect').value;

            await AIEngine.setApiKey(valKey);
            await AIEngine.setModel(valModel);

            showToast('general.success', 'success');
        });

        // Handle Create Custom Challenge form
        document.getElementById('addChallengeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newCh = {
                category: document.getElementById('chCategory').value,
                difficulty: document.getElementById('chDifficulty').value,
                titleAr: document.getElementById('chTitleAr').value,
                titleEn: document.getElementById('chTitleEn').value,
                descAr: document.getElementById('chDescAr').value,
                descEn: document.getElementById('chDescEn').value,
                // Default helper questions
                questionsAr: [
                    'ما هي الأطراف المتأثرة بهذه المشكلة؟',
                    'كيف نوازن بين المزايا والأضرار المحتملة؟',
                    'هل هناك بديل آخر لم نتطرق إليه؟'
                ],
                questionsEn: [
                    'Who are the main parties affected by this problem?',
                    'How do we balance the benefits against potential harms?',
                    'Is there a third alternative we haven\'t considered yet?'
                ],
                createdAt: new Date().toISOString()
            };

            await db.customChallenges.add(newCh);
            document.getElementById('addChallengeForm').reset();
            showToast('general.success', 'success');
            // Re-render to show new challenge in the management list
            renderDashboardPage();
        });

        // Handle Delete Challenge buttons
        container.querySelectorAll('.btn-delete-challenge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const challengeId = btn.getAttribute('data-id');
                const challengeItem = btn.closest('.manage-challenge-item');
                const challengeTitle = challengeItem ? challengeItem.querySelector('div[style*="font-weight: 600"]')?.textContent?.trim() : '';

                showDeleteConfirmModal(challengeId, challengeTitle);
            });
        });

        // Individual Student Item Click listener logic
        container.querySelectorAll('.student-item').forEach(item => {
            item.addEventListener('click', async () => {
                const id = parseInt(item.getAttribute('data-id'), 10);
                const student = users.find(u => u.id === id);
                if (!student) return;

                const studSessions = completedSessions.filter(s => s.userId === id);
                const detailsPane = document.getElementById('studentDetailsPane');

                detailsPane.innerHTML = `
                    <h3 style="margin-bottom: 5px; color: var(--accent-cyan);">${student.displayName}</h3>
                    <p style="color:var(--text-tertiary); font-size:0.8rem; margin-bottom: 20px;">
                        ${isAr ? `تاريخ الانضمام: ${new Date(student.createdAt).toLocaleDateString('ar-EG')}` : `Joined: ${new Date(student.createdAt).toLocaleDateString('en-US')}`}
                    </p>

                    <div style="max-height: 400px; overflow-y: auto;">
                        <h4 style="margin-bottom: 10px; font-size:0.95rem;">${isAr ? 'تقارير أداء الجلسات' : 'Session Reports'}</h4>
                        ${studSessions.length === 0 ? `
                            <p style="color:var(--text-tertiary); text-align:center; padding: 20px;">${isAr ? 'لا يوجد تحديات مكتملة للتقييم' : 'No completed challenges to evaluate'}</p>
                        ` : studSessions.map((s, idx) => {
                            const ch = allChallenges.find(c => String(c.id) === String(s.challengeId));
                            const chTitle = ch ? (isAr ? ch.titleAr : ch.titleEn) : `Challenge #${s.challengeId}`;
                            return `
                                <div class="glass-card" style="padding: var(--space-md); margin-bottom: var(--space-sm);">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                        <span style="font-weight:600; font-size:0.9rem;">${chTitle}</span>
                                        <span style="font-weight:700; color:var(--accent-cyan); font-size:0.9rem;">${s.evaluation.overall}%</span>
                                    </div>
                                    <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.6; margin-bottom:10px;">
                                        <strong>${isAr ? 'التأمل:' : 'Reflection:'}</strong> ${s.reflection}
                                    </div>
                                    <button class="btn btn-secondary btn-sm btn-teacher-review" data-sess-idx="${idx}">${isAr ? 'مراجعة الحوار السقراطي' : 'Review Socratic Dialogue'}</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;

                // Handle click on Socratic dialogue review button in modal/panel
                detailsPane.querySelectorAll('.btn-teacher-review').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const sessIdx = parseInt(btn.getAttribute('data-sess-idx'), 10);
                        showDialogueReviewModal(studSessions[sessIdx], allChallenges);
                    });
                });
            });
        });
    }

    /**
     * Render dialogue details in overlay dialog popup
     */
    function showDialogueReviewModal(session, allChallenges) {
        const isAr = I18n.getLang() === 'ar';
        const ch = allChallenges.find(c => String(c.id) === String(session.challengeId));
        const chTitle = ch ? (isAr ? ch.titleAr : ch.titleEn) : `Challenge #${session.challengeId}`;

        // Create overlay modal dynamically
        const modal = document.createElement('div');
        modal.className = 'animate-fadeIn';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-xl);
        `;

        modal.innerHTML = `
            <div class="glass-card" style="width: 100%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; padding: var(--space-xl);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
                    <h3 style="font-size:1.15rem; color:var(--accent-cyan);">${isAr ? 'سجل الحوار السقراطي' : 'Socratic Dialogue Logs'}</h3>
                    <button class="btn-icon" id="btnCloseModal">❌</button>
                </div>
                
                <div style="flex:1; overflow-y:auto; padding: 10px; display:flex; flex-direction:column; gap:10px; margin-bottom:20px; background:rgba(0,0,0,0.2); border-radius:var(--radius-sm);">
                    ${session.chatHistory.map(msg => {
                        const isUser = msg.role === 'user';
                        const sender = isUser ? (isAr ? 'الطالب' : 'Student') : (isAr ? 'الشريك الذكي' : 'AI Partner');
                        return `
                            <div style="padding:10px; border-radius: var(--radius-sm); border:1px solid ${isUser ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255,255,255,0.04)'}; background:${isUser ? 'rgba(0, 212, 255, 0.02)' : 'rgba(255,255,255,0.01)'}">
                                <div style="font-size:0.75rem; font-weight:700; color:${isUser ? 'var(--accent-violet)' : 'var(--accent-cyan)'}; margin-bottom:4px;">${sender}</div>
                                <div style="font-size:0.9rem; line-height:1.6; color:var(--text-primary);">${msg.text.replace(/\n/g, '<br>')}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#btnCloseModal').addEventListener('click', () => modal.remove());
    }

    /**
     * Show a delete confirmation modal for a challenge
     */
    function showDeleteConfirmModal(challengeId, challengeTitle) {
        const isAr = I18n.getLang() === 'ar';

        const modal = document.createElement('div');
        modal.className = 'delete-confirm-overlay animate-fadeIn';
        modal.innerHTML = `
            <div class="delete-confirm-modal glass-card">
                <div class="delete-confirm-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
                <h3 class="delete-confirm-title">${I18n.t('dashboard.confirmDelete')}</h3>
                <p class="delete-confirm-challenge-name">${challengeTitle}</p>
                <p class="delete-confirm-desc">${I18n.t('dashboard.confirmDeleteDesc')}</p>
                <div class="delete-confirm-actions">
                    <button class="btn btn-secondary" id="btnCancelDelete">${I18n.t('general.cancel')}</button>
                    <button class="btn btn-delete" id="btnConfirmDelete">${I18n.t('dashboard.deleteChallenge')}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cancel
        modal.querySelector('#btnCancelDelete').addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.2s ease forwards';
            modal.addEventListener('animationend', () => modal.remove());
        });

        // Click overlay to cancel
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.2s ease forwards';
                modal.addEventListener('animationend', () => modal.remove());
            }
        });

        // Confirm delete
        modal.querySelector('#btnConfirmDelete').addEventListener('click', async () => {
            try {
                await Challenges.deleteChallenge(challengeId);

                // Animate item removal
                const item = document.querySelector(`.manage-challenge-item[data-challenge-id="${challengeId}"]`);
                if (item) {
                    item.style.animation = 'slideOutLeft 0.3s ease forwards';
                    item.addEventListener('animationend', () => item.remove());
                }

                modal.style.animation = 'fadeOut 0.2s ease forwards';
                modal.addEventListener('animationend', () => modal.remove());

                showToast('dashboard.challengeDeleted', 'success');

                // Re-render dashboard after short delay for animations
                setTimeout(() => renderDashboardPage(), 400);
            } catch (err) {
                console.error('Error deleting challenge:', err);
                showToast('general.error', 'error');
                modal.remove();
            }
        });
    }

    return {
        init,
        navigateTo,
        showToast
    };
})();
