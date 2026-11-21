/* ============================================
   AI Critical Thinking Lab — i18n System
   نظام ثنائية اللغة
   ============================================ */

const I18n = (() => {
    // Default language
    let currentLang = 'ar';

    // Translation dictionary
    const translations = {
        ar: {
            // App
            appName: 'مختبر التفكير النقدي',
            appFullName: 'مختبر التفكير النقدي بالذكاء الاصطناعي',
            appTagline: 'شريكك الفكري لتعزيز التفكير النقدي والإبداع',

            // Nav
            'nav.home': 'الرئيسية',
            'nav.about': 'عن المشروع والدليل',
            'nav.challenges': 'التحديات',
            'nav.profile': 'ملفي',
            'nav.dashboard': 'لوحة التحكم',
            'nav.settings': 'الإعدادات',
            'nav.logout': 'تسجيل الخروج',

            // Auth
            'auth.welcome': 'مختبر التفكير النقدي',
            'auth.subtitle': 'شريكك الفكري لتعزيز التفكير النقدي والإبداع',
            'auth.username': 'اسم المستخدم',
            'auth.password': 'كلمة المرور',
            'auth.displayName': 'الاسم الكامل',
            'auth.role': 'الدور',
            'auth.student': 'طالب',
            'auth.teacher': 'معلم',
            'auth.login': 'تسجيل الدخول',
            'auth.register': 'إنشاء حساب',
            'auth.noAccount': 'ليس لديك حساب؟',
            'auth.hasAccount': 'لديك حساب بالفعل؟',
            'auth.createAccount': 'إنشاء حساب جديد',
            'auth.loginInstead': 'تسجيل الدخول',
            'auth.error.empty': 'يرجى ملء جميع الحقول',
            'auth.error.exists': 'اسم المستخدم مستخدم بالفعل',
            'auth.error.invalid': 'اسم المستخدم أو كلمة المرور غير صحيحة',
            'auth.error.short': 'كلمة المرور يجب أن تكون 4 أحرف على الأقل',
            'auth.success.register': 'تم إنشاء الحساب بنجاح!',
            'auth.success.login': 'مرحباً بعودتك!',

            // Home
            'home.heroBadge': '🧠 مدعوم بالذكاء الاصطناعي',
            'home.heroTitle1': 'طوّر تفكيرك النقدي',
            'home.heroTitle2': 'مع شريكك الذكي',
            'home.heroSubtitle': 'نظام تعليمي مبتكر يستخدم الذكاء الاصطناعي كشريك فكري يتحدى تفكيرك ويعزز إبداعك، بدلاً من تقديم إجابات جاهزة',
            'home.startChallenge': 'ابدأ تحدياً جديداً',
            'home.aboutGuide': 'عن المشروع ودليل الاستخدام',
            'home.aboutBannerTitle': 'تعرّف على المشروع ودليل الاستخدام المتكامل',
            'home.aboutBannerDesc': 'استكشف الفئات المستهدفة، دليل الاستخدام، تقنيات الذكاء الاصطناعي المستخدمة فعلياً، والأثر التعليمي الملموس على المعلم والمتعلم.',
            'home.aboutBannerBtn': 'استعراض الدليل الشامل',
            'home.learnMore': 'اعرف المزيد',
            'home.welcomeBack': 'مرحباً بعودتك',

            // Stats
            'stats.challenges': 'تحدٍ متنوع',
            'stats.skills': 'مهارة مستهدفة',
            'stats.perspectives': 'وجهات نظر',
            'stats.methodology': 'مراحل منهجية',

            // Methodology
            'method.title': 'منهجية التعلم',
            'method.subtitle': 'رحلة تعلم مصممة لتعزيز التفكير العميق والإبداع',
            'method.challenge': 'التحدي',
            'method.challengeDesc': 'مشكلات واقعية مفتوحة تدفعك للتفكير والتحليل',
            'method.interact': 'التفاعل مع الذكاء الاصطناعي',
            'method.interactDesc': 'حوار سقراطي يتحدى افتراضاتك ويوسع آفاقك',
            'method.reflect': 'التأمل والتفكير العميق',
            'method.reflectDesc': 'برر إجاباتك وراجع منطقك بناءً على الملاحظات',
            'method.evaluate': 'التقييم',
            'method.evaluateDesc': 'تقييم شامل لعمق التفكير والإبداع والتحليل',

            // UNESCO
            'unesco.subtitle': 'نظام متمحور حول الإنسان يتوافق مع المعايير الدولية',
            'unesco.ethical': 'الاستخدام الأخلاقي',
            'unesco.ethicalDesc': 'تعزيز الاستخدام الأخلاقي والمسؤول للذكاء الاصطناعي في التعليم',
            'unesco.sdg4': 'التعليم الجيد',
            'unesco.sdg4Desc': 'دعم الهدف الرابع من أهداف التنمية المستدامة',
            'unesco.creativity': 'الإبداع والتفكير النقدي',
            'unesco.creativityDesc': 'تعزيز مهارات القرن الحادي والعشرين',
            'unesco.humanCentered': 'التمحور حول الإنسان',
            'unesco.humanCenteredDesc': 'ضمان أنظمة ذكاء اصطناعي تخدم الإنسان',

            // Challenges
            'challenges.title': 'التحديات',
            'challenges.subtitle': 'اختر تحدياً وابدأ رحلة التفكير النقدي',
            'challenges.all': 'الكل',
            'challenges.science': 'العلوم',
            'challenges.ethics': 'الأخلاقيات',
            'challenges.technology': 'التكنولوجيا',
            'challenges.society': 'المجتمع',
            'challenges.environment': 'البيئة',
            'challenges.education': 'التعليم',
            'challenges.beginner': 'مبتدئ',
            'challenges.intermediate': 'متوسط',
            'challenges.advanced': 'متقدم',
            'challenges.start': 'ابدأ التحدي',
            'challenges.viewDetails': 'عرض التفاصيل',

            // Session
            'session.phase1': 'التحدي',
            'session.phase2': 'التفاعل',
            'session.phase3': 'التأمل',
            'session.phase4': 'التقييم',
            'session.sendMessage': 'أرسل رسالتك...',
            'session.send': 'إرسال',
            'session.differentView': 'وجهة نظر مختلفة',
            'session.challengeMe': 'تحدّ رأيي',
            'session.evidence': 'أريد دليلاً',
            'session.nextPhase': 'المرحلة التالية',
            'session.prevPhase': 'المرحلة السابقة',
            'session.finish': 'إنهاء وتقييم',
            'session.aiPartner': 'الشريك الذكي',
            'session.you': 'أنت',

            // Reflection
            'reflection.title': 'التأمل والتفكير العميق',
            'reflection.prompt': 'بناءً على حوارك مع الشريك الذكي، اكتب تحليلك النهائي. برر موقفك وقدم أدلة تدعم استنتاجاتك.',
            'reflection.placeholder': 'اكتب تأملك هنا... حلل وجهات النظر المختلفة، وبرر موقفك، وقدم أدلة تدعم استنتاجاتك...',
            'reflection.depth': 'عمق التفكير',
            'reflection.wordCount': 'عدد الكلمات',
            'reflection.tips': 'نصائح لتحسين تأملك',
            'reflection.tip1': 'قارن بين وجهات النظر المختلفة',
            'reflection.tip2': 'قدم أدلة ملموسة لدعم موقفك',
            'reflection.tip3': 'اذكر نقاط القوة والضعف في حجتك',
            'reflection.tip4': 'فكر في التداعيات والنتائج المحتملة',

            // Evaluation
            'eval.title': 'نتائج التقييم',
            'eval.criticalThinking': 'التفكير النقدي',
            'eval.creativity': 'الإبداع',
            'eval.evidenceQuality': 'جودة الأدلة',
            'eval.analysisDepth': 'عمق التحليل',
            'eval.overall': 'الدرجة الإجمالية',
            'eval.strengths': 'نقاط القوة',
            'eval.improvements': 'نقاط التحسين',
            'eval.feedback': 'الملاحظات',
            'eval.tryAnother': 'جرب تحدياً آخر',
            'eval.viewProfile': 'عرض ملفي',

            // Profile
            'profile.title': 'الملف الشخصي',
            'profile.completedChallenges': 'التحديات المكتملة',
            'profile.avgScore': 'متوسط الدرجات',
            'profile.totalReflections': 'إجمالي التأملات',
            'profile.badges': 'الشارات',
            'profile.history': 'سجل التحديات',
            'profile.growth': 'منحنى التطور',
            'profile.noChallenges': 'لم تكمل أي تحدٍ بعد',
            'profile.startFirst': 'ابدأ أول تحدٍ لك الآن!',

            // Dashboard
            'dashboard.title': 'لوحة التحكم',
            'dashboard.overview': 'نظرة عامة',
            'dashboard.students': 'الطلاب',
            'dashboard.totalStudents': 'إجمالي الطلاب',
            'dashboard.activeSessions': 'جلسات نشطة',
            'dashboard.avgPerformance': 'متوسط الأداء',
            'dashboard.totalSessions': 'إجمالي الجلسات',
            'dashboard.studentProgress': 'تقدم الطلاب',
            'dashboard.recentActivity': 'النشاط الأخير',
            'dashboard.settings': 'الإعدادات',
            'dashboard.apiKey': 'مفتاح OpenAI API',
            'dashboard.apiKeyPlaceholder': 'أدخل مفتاح OpenAI API',
            'dashboard.saveSettings': 'حفظ الإعدادات',
            'dashboard.addChallenge': 'إضافة تحدي',
            'dashboard.manageChallenges': 'إدارة التحديات',
            'dashboard.deleteChallenge': 'حذف التحدي',
            'dashboard.confirmDelete': 'هل أنت متأكد من حذف هذا التحدي؟',
            'dashboard.confirmDeleteDesc': 'لا يمكن التراجع عن هذه العملية.',
            'dashboard.challengeDeleted': 'تم حذف التحدي بنجاح',
            'dashboard.noStudents': 'لا يوجد طلاب مسجلين بعد',

            // General
            'general.loading': 'جاري التحميل...',
            'general.error': 'حدث خطأ',
            'general.success': 'تمت العملية بنجاح',
            'general.cancel': 'إلغاء',
            'general.save': 'حفظ',
            'general.delete': 'حذف',
            'general.edit': 'تعديل',
            'general.close': 'إغلاق',
            'general.back': 'رجوع',
            'general.next': 'التالي',
            'general.noApiKey': 'لم يتم إعداد مفتاح API. يرجى التواصل مع المعلم.',
        },

        en: {
            // App
            appName: 'Critical Thinking Lab',
            appFullName: 'AI Critical Thinking Lab',
            appTagline: 'Your intellectual partner for enhancing critical thinking and creativity',

            // Nav
            'nav.home': 'Home',
            'nav.about': 'About & Guide',
            'nav.challenges': 'Challenges',
            'nav.profile': 'Profile',
            'nav.dashboard': 'Dashboard',
            'nav.settings': 'Settings',
            'nav.logout': 'Logout',

            // Auth
            'auth.welcome': 'Critical Thinking Lab',
            'auth.subtitle': 'Your intellectual partner for enhancing critical thinking and creativity',
            'auth.username': 'Username',
            'auth.password': 'Password',
            'auth.displayName': 'Full Name',
            'auth.role': 'Role',
            'auth.student': 'Student',
            'auth.teacher': 'Teacher',
            'auth.login': 'Login',
            'auth.register': 'Create Account',
            'auth.noAccount': "Don't have an account?",
            'auth.hasAccount': 'Already have an account?',
            'auth.createAccount': 'Create new account',
            'auth.loginInstead': 'Login',
            'auth.error.empty': 'Please fill in all fields',
            'auth.error.exists': 'Username already taken',
            'auth.error.invalid': 'Invalid username or password',
            'auth.error.short': 'Password must be at least 4 characters',
            'auth.success.register': 'Account created successfully!',
            'auth.success.login': 'Welcome back!',

            // Home
            'home.heroBadge': '🧠 AI-Powered',
            'home.heroTitle1': 'Develop Your Critical Thinking',
            'home.heroTitle2': 'With Your Smart Partner',
            'home.heroSubtitle': 'An innovative educational system that uses AI as an intellectual partner to challenge your thinking and enhance creativity, rather than providing ready-made answers',
            'home.startChallenge': 'Start a New Challenge',
            'home.aboutGuide': 'About Project & User Guide',
            'home.aboutBannerTitle': 'Discover the Project & Comprehensive User Guide',
            'home.aboutBannerDesc': 'Explore target audiences, user guide, actual AI technologies used, and real educational impact on teachers and students.',
            'home.aboutBannerBtn': 'Explore Full Guide',
            'home.learnMore': 'Learn More',
            'home.welcomeBack': 'Welcome back',

            // Stats
            'stats.challenges': 'Diverse Challenges',
            'stats.skills': 'Targeted Skills',
            'stats.perspectives': 'Perspectives',
            'stats.methodology': 'Methodology Phases',

            // Methodology
            'method.title': 'Learning Methodology',
            'method.subtitle': 'A learning journey designed to enhance deep thinking and creativity',
            'method.challenge': 'Challenge',
            'method.challengeDesc': 'Open-ended real-world problems that push you to think and analyze',
            'method.interact': 'AI Interaction',
            'method.interactDesc': 'Socratic dialogue that challenges your assumptions and broadens your horizons',
            'method.reflect': 'Deep Reflection',
            'method.reflectDesc': 'Justify your answers and review your logic based on feedback',
            'method.evaluate': 'Evaluation',
            'method.evaluateDesc': 'Comprehensive assessment of thinking depth, creativity, and analysis',

            // UNESCO
            'unesco.subtitle': 'A human-centered system aligned with international standards',
            'unesco.ethical': 'Ethical Use',
            'unesco.ethicalDesc': 'Promoting ethical and responsible use of AI in education',
            'unesco.sdg4': 'Quality Education',
            'unesco.sdg4Desc': 'Supporting SDG 4 - Quality Education',
            'unesco.creativity': 'Creativity & Critical Thinking',
            'unesco.creativityDesc': 'Enhancing 21st century skills',
            'unesco.humanCentered': 'Human-Centered',
            'unesco.humanCenteredDesc': 'Ensuring AI systems that serve humanity',

            // Challenges
            'challenges.title': 'Challenges',
            'challenges.subtitle': 'Choose a challenge and start your critical thinking journey',
            'challenges.all': 'All',
            'challenges.science': 'Science',
            'challenges.ethics': 'Ethics',
            'challenges.technology': 'Technology',
            'challenges.society': 'Society',
            'challenges.environment': 'Environment',
            'challenges.education': 'Education',
            'challenges.beginner': 'Beginner',
            'challenges.intermediate': 'Intermediate',
            'challenges.advanced': 'Advanced',
            'challenges.start': 'Start Challenge',
            'challenges.viewDetails': 'View Details',

            // Session
            'session.phase1': 'Challenge',
            'session.phase2': 'Interaction',
            'session.phase3': 'Reflection',
            'session.phase4': 'Evaluation',
            'session.sendMessage': 'Type your message...',
            'session.send': 'Send',
            'session.differentView': 'Different Perspective',
            'session.challengeMe': 'Challenge Me',
            'session.evidence': 'Show Evidence',
            'session.nextPhase': 'Next Phase',
            'session.prevPhase': 'Previous Phase',
            'session.finish': 'Finish & Evaluate',
            'session.aiPartner': 'AI Partner',
            'session.you': 'You',

            // Reflection
            'reflection.title': 'Deep Reflection',
            'reflection.prompt': 'Based on your dialogue with the AI partner, write your final analysis. Justify your position and provide evidence supporting your conclusions.',
            'reflection.placeholder': 'Write your reflection here... Analyze different perspectives, justify your position, and provide evidence supporting your conclusions...',
            'reflection.depth': 'Thinking Depth',
            'reflection.wordCount': 'Word Count',
            'reflection.tips': 'Tips to Improve Your Reflection',
            'reflection.tip1': 'Compare different perspectives',
            'reflection.tip2': 'Provide concrete evidence to support your position',
            'reflection.tip3': 'Mention strengths and weaknesses of your argument',
            'reflection.tip4': 'Think about potential implications and outcomes',

            // Evaluation
            'eval.title': 'Evaluation Results',
            'eval.criticalThinking': 'Critical Thinking',
            'eval.creativity': 'Creativity',
            'eval.evidenceQuality': 'Evidence Quality',
            'eval.analysisDepth': 'Analysis Depth',
            'eval.overall': 'Overall Score',
            'eval.strengths': 'Strengths',
            'eval.improvements': 'Areas for Improvement',
            'eval.feedback': 'Feedback',
            'eval.tryAnother': 'Try Another Challenge',
            'eval.viewProfile': 'View Profile',

            // Profile
            'profile.title': 'Profile',
            'profile.completedChallenges': 'Completed Challenges',
            'profile.avgScore': 'Average Score',
            'profile.totalReflections': 'Total Reflections',
            'profile.badges': 'Badges',
            'profile.history': 'Challenge History',
            'profile.growth': 'Growth Curve',
            'profile.noChallenges': 'No challenges completed yet',
            'profile.startFirst': 'Start your first challenge now!',

            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.overview': 'Overview',
            'dashboard.students': 'Students',
            'dashboard.totalStudents': 'Total Students',
            'dashboard.activeSessions': 'Active Sessions',
            'dashboard.avgPerformance': 'Average Performance',
            'dashboard.totalSessions': 'Total Sessions',
            'dashboard.studentProgress': 'Student Progress',
            'dashboard.recentActivity': 'Recent Activity',
            'dashboard.settings': 'Settings',
            'dashboard.apiKey': 'OpenAI API Key',
            'dashboard.apiKeyPlaceholder': 'Enter OpenAI API Key',
            'dashboard.saveSettings': 'Save Settings',
            'dashboard.addChallenge': 'Add Challenge',
            'dashboard.manageChallenges': 'Manage Challenges',
            'dashboard.deleteChallenge': 'Delete Challenge',
            'dashboard.confirmDelete': 'Are you sure you want to delete this challenge?',
            'dashboard.confirmDeleteDesc': 'This action cannot be undone.',
            'dashboard.challengeDeleted': 'Challenge deleted successfully',
            'dashboard.noStudents': 'No students registered yet',

            // General
            'general.loading': 'Loading...',
            'general.error': 'An error occurred',
            'general.success': 'Operation successful',
            'general.cancel': 'Cancel',
            'general.save': 'Save',
            'general.delete': 'Delete',
            'general.edit': 'Edit',
            'general.close': 'Close',
            'general.back': 'Back',
            'general.next': 'Next',
            'general.noApiKey': 'API key not configured. Please contact your teacher.',
        }
    };

    /**
     * Get translation for a key
     */
    function t(key) {
        return translations[currentLang]?.[key] || translations['ar']?.[key] || key;
    }

    /**
     * Set current language
     */
    function setLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.style.setProperty('--font-family', lang === 'ar' ? 'var(--font-ar)' : 'var(--font-en)');
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        // Update lang toggle button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.querySelector('.lang-label').textContent = lang === 'ar' ? 'EN' : 'عر';
            langToggle.title = lang === 'ar' ? 'English' : 'العربية';
        }

        document.querySelectorAll('[data-auth-lang]').forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-auth-lang') === lang);
            button.setAttribute('aria-pressed', button.getAttribute('data-auth-lang') === lang ? 'true' : 'false');
        });

        // Save preference
        localStorage.setItem('ctlab_lang', lang);
    }

    /**
     * Get current language
     */
    function getLang() {
        return currentLang;
    }

    /**
     * Initialize language from saved preference
     */
    function init() {
        const saved = localStorage.getItem('ctlab_lang');
        if (saved && translations[saved]) {
            setLang(saved);
        } else {
            setLang('ar');
        }
    }

    /**
     * Toggle between languages
     */
    function toggle() {
        setLang(currentLang === 'ar' ? 'en' : 'ar');
    }

    return { t, setLang, getLang, init, toggle };
})();
