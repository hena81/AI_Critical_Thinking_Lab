/* ============================================
   AI Critical Thinking Lab — About & User Guide Module
   عن المشروع ودليل الاستخدام المتكامل
   ============================================ */

const AboutModule = (() => {

    /**
     * Data content for About & Guide Page (Dual-Language)
     */
    const content = {
        ar: {
            badge: '🌟 الدليل الشامل والتعريف بالمشروع',
            title: 'عن المشروع ودليل الاستخدام',
            subtitle: 'منظومة تعليمية متطورة تسخّر الذكاء الاصطناعي كشريك فكري سقراطي لتعزيز التفكير النقدي، الإبداع، وعمق الاستدلال المنطقي.',
            
            navTabs: [
                { id: 'sec-audience', icon: '🎯', label: 'الفئات المستهدفة' },
                { id: 'sec-guide', icon: '📖', label: 'دليل الاستخدام' },
                { id: 'sec-tech', icon: '🤖', label: 'تقنيات الذكاء الاصطناعي' },
                { id: 'sec-impact', icon: '📈', label: 'الأثر على المعلم والمتعلم' },
                { id: 'sec-kpis', icon: '🏆', label: 'مؤشرات قياس النجاح' }
            ],

            // Section 1: Target Audience
            audience: {
                badge: '🎯 الفئات المستفيدة',
                title: 'لمن صُمم هذا المختبر؟',
                subtitle: 'يخدم المشروع منظومة متكاملة من أطراف العملية التعليمية عبر أدوار مصممة بعناية:',
                items: [
                    {
                        role: 'المعلمون والمشرفون التربويون',
                        icon: '👨‍🏫',
                        color: 'cyan',
                        badge: 'أدوات التوجيه والتقييم',
                        desc: 'يمكّن المعلم من الانتقال من دور "ملقن المعلومات" إلى دور "ميسّر التفكير العالي"، مع تزويده بلوحة تحكم تحليلية تتابع مهارات التفكير لدى كل طالب بدقة كمية ونوعية.',
                        benefits: [
                            'لوحة تحكم ذكية ترصد أداء الطلاب وتوزيعهم حسب المهارات الإدراكية.',
                            'توفير حتى 70% من الوقت المستهلك في تصحيح المقالات والملاحظات الإنشائية.',
                            'إمكانية إنشاء تحديات ومعضلات فكرية مخصصة مرتبطة بالمناهج الدراسية.',
                            'كشف الفروق الفردية في مهارات الاستدلال ونقاط الضعف الفكرية بدقة موضوعية.'
                        ]
                    },
                    {
                        role: 'المتعلمون والطلاب',
                        icon: '🎓',
                        color: 'purple',
                        badge: 'المستفيد المباشر',
                        desc: 'يمنح الطالب بيئة فكرية تفاعلية آمنة تتحدى تفكيره وتدفعه لبناء حجج منطقية ومراجعة قناعاته، بدلاً من الاعتماد الكسول على الإجابات الجاهزة من أدوات الذكاء الاصطناعي التقليدية.',
                        benefits: [
                            'شريك فكري شخصي متاح 24/7 يحاوره بأسلوب سقراطي محفز دون إعطاء إجابات جاهزة.',
                            'تنمية مهارات التفكير النقدي، الإبداع، مقارنة وجهات النظر، والبرهنة المنطقية.',
                            'تغذية راجعة فورية ومخطط راداري يوضح نقاط القوة وفرص التحسين بعد كل جلسة.',
                            'نظام شارات وتحفيز يعزز الاستقلالية الفكرية ومتعة التحدي المعرفي.'
                        ]
                    },
                    {
                        role: 'الإدارات التعليمية والقيادات المدرسية',
                        icon: '🏛️',
                        color: 'gold',
                        badge: 'المستوى المؤسسي',
                        desc: 'يوفر للإدارات المدرسية مؤشرات أداء موثوقة لقياس جودة مخرجات التعلم في مهارات القرن الحادي والعشرين، مع مواءمة تامة للمعايير الدولية للتعليم وأخلاقيات الذكاء الاصطناعي.',
                        benefits: [
                            'مواءمة عملية مع توصيات اليونسكو لأخلاقيات الذكاء الاصطناعي والهدف الرابع (SDG 4).',
                            'تقارير موثوقة حول نضج مهارات التفكير العليا للطلاب على مستوى الفصول والمراحل.',
                            'منصة آمنة تعمل بالتخزين المحلي والسحابي بمرونة عالية وتكلفة تشغيلية منخفضة.',
                            'ترسيخ ثقافة الاستخدام المسؤول والأخلاقي للذكاء الاصطناعي داخل المؤسسة التعليمية.'
                        ]
                    },
                    {
                        role: 'مطورو المناهج والباحثون التربويون',
                        icon: '🔬',
                        color: 'emerald',
                        badge: 'التطوير والابتكار',
                        desc: 'يقدم نموذجاً تطبيقياً واقعياً قابلاً للدراسة والقياس حول أثر توظيف نماذج اللغات الكبيرة (LLMs) كـ "ميسر سقراطي" على تنمية التفكير الناقد والكتابة التأملية.',
                        benefits: [
                            'قاعدة بيانات ثرية لتحليلات الأداء تسهم في تصميم وحدات دراسية تحفز التفكير.',
                            'نموذج منهجي مثبت (المراحل الأربع) يدمج الفلسفة السقراطية مع الذكاء الاصطناعي الحديث.',
                            'دراسة أثر الانتقال من أسلوب "محرك الإجابات" إلى أسلوب "محاور التفكير" لدى المتعلمين.'
                        ]
                    }
                ]
            },

            // Section 2: User Guide
            guide: {
                badge: '📖 دليل الاستخدام التفاعلي',
                title: 'كيف تستفيد من المختبر خطوة بخطوة؟',
                subtitle: 'صُممت تجربة المستخدم لتكون بسيطة وسلسة وتفاعلية عبر 5 خطوات متتابعة:',
                
                steps: [
                    {
                        number: '01',
                        title: 'إنشاء الحساب وتحديد الدور',
                        desc: 'اختر دورك (طالب أو معلم) وسجل الدخول للوصول إلى لوحة التجربة المخصصة لاحتياجاتك.',
                        tip: 'الحسابات الافتراضية للتجربة: المعلم (teacher / teacher123) أو الطالب (student / student123).'
                    },
                    {
                        number: '02',
                        title: 'استكشاف التحدي والمعضلة الفكرية',
                        desc: 'تصفح مكتبة التحديات المصنفة حسب مجالات (العلوم، الأخلاقيات، التكنولوجيا، المجتمع، البيئة) ومستويات الصعوبة، واطلع على الأسئلة التوجيهية المثيرة للتفكير.',
                        tip: 'تحتوي المكتبة على معضلات معاصرة مثل تعديل الجينات CRISPR، والسيارات ذاتية القيادة، وأخلاقيات الذكاء الاصطناعي.'
                    },
                    {
                        number: '03',
                        title: 'خوض الحوار السقراطي مع الشريك الذكي',
                        desc: 'ادخل في نقاش تفاعلي متعدد الجولات مع الذكاء الاصطناعي. الشريك لا يعطيك حلاً جاهزاً، بل يطرح عليك تساؤلات ذكية تفكك افتراضاتك وتتحداك لتقديم أدلة مقنعة.',
                        tip: 'استخدم الأزرار التفاعلية السريعة: "وجهة نظر مختلفة"، "تحدّ رأيي"، أو "أريد دليلاً" لتوجيه دفة النقاش.'
                    },
                    {
                        number: '04',
                        title: 'كتابة التأمل والتحليل النهائي',
                        desc: 'بعد انتهاء جولات الحوار، انتقل لمرحلة التأمل لكتابة استنتاجك النهائي وموقفك المبرر بناءً على ما اكتشفته خلال النقاش.',
                        tip: 'يعرض المحرر مؤشراً فورياً لعمق التفكير ومستوى الاستدلال وعدد الكلمات لمساعدتك في تجويد كتابتك.'
                    },
                    {
                        number: '05',
                        title: 'استلام التقييم الذكي التراكمي',
                        desc: 'يحلل المحرك حوارك وتأملك النهائي ويصدر تقييماً شاملاً عبر مخطط راداري يغطي 4 مهارات أساسية، إلى جانب نقاط القوة وتوصيات عملية للتحسين.',
                        tip: 'تُحفظ جميع التقييمات في ملفك الشخصي لكسب الشارات التقديرية ومتابعة منحنى تطورك المستمر.'
                    }
                ],

                // UI Sections Breakdown
                uiSectionsTitle: 'شرح أقسام واجهة المستخدم الرئيسية',
                uiSections: [
                    {
                        icon: '🏠',
                        name: 'الصفحة الرئيسية (Home)',
                        desc: 'بوابة الانطلاق التي تستعرض الرؤية والمنهجية المتبعة، وأهم الإحصائيات، والمواءمة مع معايير اليونسكو للتنمية المستدامة.'
                    },
                    {
                        icon: '🎯',
                        name: 'مكتبة التحديات (Challenges Hub)',
                        desc: 'أرشيف غني بالمعضلات الواقعية، مزود بمحرك بحث فوري وتصنيفات دقيقة وفلاتر للمستويات (مبتدئ، متوسط، متقدم).'
                    },
                    {
                        icon: '💬',
                        name: 'غرفة جلسة التحدي (Interactive Session)',
                        desc: 'المساحة المركزية التي تضم المراحل الأربع: التحدي، الحوار السقراطي المباشر، التأمل الذاتي، والتقييم النهائي.'
                    },
                    {
                        icon: '👤',
                        name: 'الملف الشخصي للطالب (Profile)',
                        desc: 'لوحة القيادة الشخصية التي تعرض معدلات الأداء، والمخطط الراداري التراكمي، وسجل الجلسات، وشارات التميز المكتسبة.'
                    },
                    {
                        icon: '📊',
                        name: 'لوحة تحكم المعلم (Teacher Dashboard)',
                        desc: 'مساحة مخصصة للمعلمين لإدارة الطلاب، مراقبة التقدم الصفي، إضافة معضلات وتحديات مخصصة، وضبط إعدادات مفتاح الذكاء الاصطناعي.'
                    }
                ],

                // Socratic vs Traditional AI visual comparison
                comparisonTitle: 'الفرق الجوهري: كيف يختلف مختبرنا عن الذكاء الاصطناعي التقليدي؟',
                compTradTitle: 'الذكاء الاصطناعي التقليدي (ChatGPT وغيره)',
                compTradDesc: 'يقدم إجابات جاهزة ومباشرة للمشكلة، مما يؤدي إلى:',
                compTradPoints: [
                    '❌ إلغاء الجهد الذهني للمتعلم وتعزيز الكسل الإدراكي.',
                    '❌ قبول المعلومات كحقائق مسلمة دون تمحيص أو تدقيق.',
                    '❌ تشجيع ثقافة النسخ واللصق دون فهم حقيقي للحلول.'
                ],
                compLabTitle: 'مختبر التفكير النقدي (منهجيتنا السقراطية)',
                compLabDesc: 'يحظر تقديم الحلول الجاهزة ويتبنى دور الشريك الفكري:',
                compLabPoints: [
                    '✅ يطرح أسئلة استقصائية ذكية تدفعك للتحليل والبحث عن الأسباب.',
                    '✅ يعرض وجهات نظر متعارضة تكشف الانحيازات وتوسع أفق التفكير.',
                    '✅ يطالبك بالدليل والبرهان المنطقي ويدربك على الكتابة التأملية.'
                ]
            },

            // Section 3: AI Tools & Tech
            tech: {
                badge: '🤖 التقنيات المعتمدة فعلياً',
                title: 'أدوات وتقنيات الذكاء الاصطناعي المستخدمة',
                subtitle: 'قائمة دقيقة ومفصلة بالتقنيات المستخدمة فعلياً في بناء وتشغيل المشروع دون أي أدوات افتراضية:',
                items: [
                    {
                        name: 'OpenAI Chat Completions API & Models',
                        version: 'GPT-4o / GPT-4o-mini / GPT-5.2 Series',
                        icon: '🧠',
                        color: 'cyan',
                        purpose: 'العقل المدبر للحوار السقراطي ونظام التقييم الأكاديمي',
                        howUsed: 'يتم توظيفه عبر مسارين محكمين: الأول للحوار السقراطي المباشر مع الطالب وفق تعليمات مشددة تمنع إعطاء الحلول وتفرض طرح الأسئلة الفلسفية المعمقة، والثاني كمقيّم أكاديمي يحلل الحوار والنص التأملي.',
                        valueAdded: 'توفير محاور سقراطي ذكي وخبير متاح بشكل فردي لكل طالب، ومقيّم موضوعي قادر على قراءة وتحليل الحجج المنطقية في أجزاء من الثانية.'
                    },
                    {
                        name: 'تقنية الاستجابة المهيكلة (Strict JSON Mode)',
                        version: 'OpenAI JSON Object Response Format',
                        icon: '📋',
                        color: 'purple',
                        purpose: 'ضبط مخرجات التقييم بدقة برمجية خالية من الهلوسة',
                        howUsed: 'توجيه نموذج الذكاء الاصطناعي لإرجاع كائن JSON موحد يحتوي حصراً على الدرجات الرقمية للمهارات الأربع (0-100)، والملاحظات النقدية، ونقاط القوة المحددة، والتوصيات العملية.',
                        valueAdded: 'ضمان استقرار التحليلات البرمجية، وتغذية الرسوم البيانية وقواعد البيانات بقيم عددية ومعيارية دقيقة دون أخطاء تنسيق.'
                    },
                    {
                        name: 'البوابة الخادومية الآمنة (Secure Server API Proxy)',
                        version: 'ASP.NET Core (Program.cs) & ASP.NET 4.8 (api.ashx)',
                        icon: '🔒',
                        color: 'gold',
                        purpose: 'حماية الاعتمادات وتأمين اتصالات الذكاء الاصطناعي وتخزين البيانات',
                        howUsed: 'تعمل كنقطة اتصال خادومية وسيطة تستقبل طلبات الموقع وتتحقق منها ثم تتواصل مع خوادم OpenAI، مع إخفاء مفتاح الـ API تماماً عن متصفح المستخدم وحفظ البيانات بملفات JSON خادومية.',
                        valueAdded: 'حماية المفاتيح والميزانية المخصصة للاستخدام المدرسي من التسريب، مع إتاحة خيار العمل السحابي والمحلي بمرونة كاملة.'
                    },
                    {
                        name: 'مكتبة نمذجة المهارات (Chart.js Visualization)',
                        version: 'Chart.js v4.4.7 (UMD)',
                        icon: '📊',
                        color: 'emerald',
                        purpose: 'تحويل تقييمات الذكاء الاصطناعي الرقمية إلى مخطط راداري تفاعلي',
                        howUsed: 'تجسيد مصفوفة المهارات الإدراكية الرباعية (التفكير النقدي، الإبداع، جودة الأدلة، عمق التحليل) في رسم راداري يوضح التوازن الإدراكي للطلاب ومنحنى نموهم عبر الجلسات.',
                        valueAdded: 'تمكين الطالب والمعلم من تشخيص المهارات بصرياً في ثوانٍ معدودة، مما يعزز الإدراك الذاتي للقدرات الفكرية.'
                    },
                    {
                        name: 'محرك التخزين الهجين (Dexie.js IndexedDB Engine)',
                        version: 'Dexie.js v4.0.11 (IndexedDB API Wrapper)',
                        icon: '💾',
                        color: 'rose',
                        purpose: 'الحفظ التراكمي الفوري لبيانات الجلسات والملفات الشخصية محلياً',
                        howUsed: 'إدارة قاعدة بيانات غنية ومفهرسة داخل متصفح المستخدم تحفظ جلسات التحدي وتفاصيل الحوار والتأمل والشارات التقديرية بشكل فوري دون الاعتماد الحصري على الشبكة.',
                        valueAdded: 'سرعة استجابة فائقة (Zero Latency) وعدم فقدان أي كلمة يكتبها الطالب أثناء جلسة الحوار والتأمل حتى في حال تذبذب اتصال الإنترنت.'
                    }
                ]
            },

            // Section 4: Educational Impact
            impact: {
                badge: '📈 التحول والأثر التربوي',
                title: 'أثر استخدام المشروع على المعلم والمتعلم',
                subtitle: 'معالجة جذرية للتحديات التعليمية المعاصرة وإحداث نقلة نوعية في ممارسات التفكير والتدريس:',
                
                problemChallenge: {
                    title: 'المشكلة التعليمية الكبرى التي يعالجها المشروع',
                    desc: 'مع الانفجار التكنولوجي لأدوات الذكاء الاصطناعي التوليدي، واجه التعليم أزمة "الكسل الفكري" وتراجع مهارات التفكير النقدي، حيث بات الطلاب يعتمدون على توليد الواجبات والأبحاث الجاهزة بضغطة زر دون قراءة أو تحليل. في المقابل، يفتقر المعلم للأدوات التي تمكنه من تقييم عمق التفكير الفردي لكل طالب داخل الفصول المكتظة.'
                },

                comparisonGrid: [
                    {
                        title: 'الصعوبات قبل تطبيق المشروع',
                        teacherTitle: 'قبل: معاناة المعلم',
                        teacherPoints: [
                            'استنزاف عشرات الساعات أسبوعياً في تصحيح المقالات وتدوين الملاحظات الإنشائية يدوياً.',
                            'استحالة فتح حوار سقراطي فردي مخصص (1-to-1) مع كل طالب في ظل كثافة الفصول.',
                            'صعوبة قياس وتوثيق مهارات التفكير العليا (التحليل، البرهنة، الإبداع) بدرجات كمية موحدة.',
                            'تزايد حالات النسخ واللصق دون وسيلة عملية لتحويل الذكاء الاصطناعي إلى أداة تعلم نافعة.'
                        ],
                        studentTitle: 'قبل: معاناة المتعلم',
                        studentPoints: [
                            'التعود على تلقي الإجابات المباشرة دون بذل جهد في التقصي والتحليل المنطقي.',
                            'الخوف أو التردد من المشاركة وإبداء الرأي غير النمطي خشية الإحراج أمام الزملاء.',
                            'الاستسلام للانحياز التأكيدي والتمسك برأي واحد دون معرفة وجهات النظر المعارضة.',
                            'غياب التغذية الراجعة التفصيلية والفورية على جودة حججهم وطريقة استدلالهم.'
                        ]
                    },
                    {
                        title: 'النتائج بعد تطبيق المشروع',
                        teacherTitle: 'بعد: تمكين وتطوير أداء المعلم',
                        teacherPoints: [
                            'توفير ما يصل إلى 70% من وقت المراجعة والتقييم، مع الحصول على تحليلات دقيقة وفورية.',
                            'التحول من دور "ناقل المعرفة" إلى دور "موجه التفكير وميسر المناقشات الصفية العميقة".',
                            'امتلاك تشخيص فردي دقيق لنقاط قوة وضعف كل طالب في مهارات التفكير لتوجيه الدعم.',
                            'القدرة على تكليف الطلاب بمهام تفكير ثرية مع ضمان قيامهم بالتفكير الذاتي والتحليل.'
                        ],
                        studentTitle: 'بعد: ارتقاء مستوى تفكير وتفاعل المتعلم',
                        studentPoints: [
                            'بناء مرونة فكرية وتدريب عملي على التشكيك المنطقي وتقبل وجهات النظر المختلفة.',
                            'اكتساب مهارة تدعيم الآراء بالأدلة والبراهين الواقعية بدلاً من طرح الآراء المرسلة.',
                            'تنمية مهارات التعبير والكتابة التأملية المحكمة تحت إشراف مؤشرات عمق التحليل.',
                            'تعزيز الثقة بالذات والشعور بالإنجاز من خلال شارات التميز والمخطط الراداري.'
                        ]
                    }
                ],

                kpisTitle: 'المؤشرات والنتائج المعتمدة لقياس نجاح المشروع',
                kpisSubtitle: 'يرتكز قياس أثر المشروع على مؤشرات أداء كمية ونوعية دقيقة مستخرجة آلياً من جلسات الطلاب:',
                kpis: [
                    {
                        metric: 'مؤشر النمو في التفكير النقدي',
                        target: '+25% إلى +40%',
                        desc: 'قياس الفارق الإحصائي في متوسط درجات التفكير النقدي وجودة الأدلة بين الجلسات الأولى والجلسات اللاحقة للمتعلم.'
                    },
                    {
                        metric: 'معدل جودة وعمق التأمل',
                        target: 'متوسط 120+ كلمة نوعية',
                        desc: 'تحليل نصوص التأمل عبر مؤشر عمق التفكير اللغوي ومقارنة البدائل، والانتقال من التأمل السطحي إلى التحليل المعمق.'
                    },
                    {
                        metric: 'معدل التفاعل مع الأسئلة السقراطية',
                        target: '4 إلى 8 جولات حوارية',
                        desc: 'تفاعل الطالب مع استفسارات الشريك الذكي، وطلب "وجهات نظر مختلفة" و"تحدّ رأيي" لتوسيع المدارك.'
                    },
                    {
                        metric: 'توفير وقت وجهد المعلم',
                        target: 'توفير نحو 70% من الوقت',
                        desc: 'انخفاض الوقت المستغرق في الرصد والتصحيح الإنشائي، مع رفع جودة التغذية الراجعة المقدمة للطالب إلى مستوى فوري وشخصي.'
                    }
                ]
            },

            // Call to action button at bottom of guide
            cta: {
                title: 'جاهز لخوض تجربة التفكير النقدي؟',
                subtitle: 'انطلق الآن في استكشاف التحديات الفكرية وشارك عقلك في حوار سقراطي استثنائي.',
                startBtn: 'ابدأ أول تحدٍ الآن',
                loginBtn: 'تسجيل الدخول كمعلم أو طالب',
                backToHome: 'العودة للرئيسية'
            }
        },

        en: {
            badge: '🌟 Comprehensive Project Overview & Guide',
            title: 'About the Project & User Guide',
            subtitle: 'An advanced educational system that harnesses AI as a Socratic intellectual partner to foster critical thinking, creativity, and deep logical reasoning.',
            
            navTabs: [
                { id: 'sec-audience', icon: '🎯', label: 'Target Audience' },
                { id: 'sec-guide', icon: '📖', label: 'User Guide' },
                { id: 'sec-tech', icon: '🤖', label: 'AI Technologies' },
                { id: 'sec-impact', icon: '📈', label: 'Educational Impact' },
                { id: 'sec-kpis', icon: '🏆', label: 'Success Indicators' }
            ],

            audience: {
                badge: '🎯 Target Audience',
                title: 'Who is this Lab Designed For?',
                subtitle: 'The project serves a comprehensive educational ecosystem through carefully designed roles:',
                items: [
                    {
                        role: 'Teachers & Educational Supervisors',
                        icon: '👨‍🏫',
                        color: 'cyan',
                        badge: 'Guidance & Evaluation Tools',
                        desc: 'Enables teachers to transition from "information providers" to "facilitators of higher-order thinking", equipped with an analytical dashboard tracking each student\'s cognitive skills quantitatively and qualitatively.',
                        benefits: [
                            'Smart analytics dashboard monitoring student performance across cognitive skills.',
                            'Saves up to 70% of time typically spent grading essays and writing individual feedback.',
                            'Ability to create customized ethical and scientific dilemmas aligned with curricula.',
                            'Accurate objective detection of individual reasoning gaps and intellectual biases.'
                        ]
                    },
                    {
                        role: 'Students & Learners',
                        icon: '🎓',
                        color: 'purple',
                        badge: 'Direct Beneficiaries',
                        desc: 'Provides students with a safe, interactive intellectual environment that challenges assumptions and drives evidence-based argumentation, rather than passive reliance on ready-made answers.',
                        benefits: [
                            '24/7 personal intellectual partner engaging in Socratic dialogue without giving away solutions.',
                            'Development of critical thinking, creativity, multi-perspective analysis, and argumentation.',
                            'Immediate feedback and interactive radar chart highlighting strengths and improvement areas.',
                            'Badge achievement system fostering intellectual independence and curiosity.'
                        ]
                    },
                    {
                        role: 'School Leadership & Educational Admin',
                        icon: '🏛️',
                        color: 'gold',
                        badge: 'Institutional Level',
                        desc: 'Equips school leaders with reliable metrics measuring 21st-century skill outcomes, aligned with international standards for educational quality and AI ethics.',
                        benefits: [
                            'Practical alignment with UNESCO Recommendations on AI Ethics and SDG 4 (Quality Education).',
                            'Reliable institutional reports on higher-order thinking maturity across classrooms and grades.',
                            'Secure platform operating with flexible local and cloud storage at low operational costs.',
                            'Fostering a culture of responsible and ethical AI adoption across educational institutions.'
                        ]
                    },
                    {
                        role: 'Curriculum Developers & Researchers',
                        icon: '🔬',
                        color: 'emerald',
                        badge: 'Innovation & Research',
                        desc: 'Offers a measurable real-world implementation demonstrating the impact of Large Language Models (LLMs) as Socratic facilitators on critical thinking and reflective writing.',
                        benefits: [
                            'Rich empirical performance data informing curriculum design that stimulates thinking.',
                            'Proven 4-phase methodology combining classical Socratic dialogue with modern AI.',
                            'Researching the shift from "answer generation" to "thought stimulation" in learners.'
                        ]
                    }
                ]
            },

            guide: {
                badge: '📖 Interactive User Guide',
                title: 'How to Use the Lab Step-by-Step',
                subtitle: 'The user journey is designed to be intuitive, engaging, and structured across 5 sequential steps:',
                
                steps: [
                    {
                        number: '01',
                        title: 'Create Account & Select Role',
                        desc: 'Choose your role (Student or Teacher) and log in to access your customized dashboard and features.',
                        tip: 'Default accounts available for immediate testing: Teacher (teacher / teacher123) or Student (student / student123).'
                    },
                    {
                        number: '02',
                        title: 'Explore Challenge & Core Dilemma',
                        desc: 'Browse the categorized challenge library (Science, Ethics, Technology, Society, Environment) with difficulty levels and read thought-provoking guiding questions.',
                        tip: 'Topics feature modern dilemmas like CRISPR gene editing, autonomous vehicles, and generative AI ethics.'
                    },
                    {
                        number: '03',
                        title: 'Engage in Socratic Dialogue with AI Partner',
                        desc: 'Participate in a multi-turn dialogue with the AI. The partner never gives answers; instead, it asks sharp questions challenging your assumptions and demanding evidence.',
                        tip: 'Use interactive quick actions: "Different View", "Challenge Me", or "I Need Evidence" to steer the debate.'
                    },
                    {
                        number: '04',
                        title: 'Write Deep Reflection & Synthesis',
                        desc: 'Synthesize your final arguments and justified conclusion based on the insights gained during the Socratic debate.',
                        tip: 'Real-time indicators show word count and reflection depth (Beginner, Intermediate, Advanced) to enhance quality.'
                    },
                    {
                        number: '05',
                        title: 'Receive Multi-Dimensional Evaluation',
                        desc: 'The AI engine analyzes dialogue and reflection, generating a radar chart of 4 core skills along with detailed strengths and recommendations.',
                        tip: 'Results are saved to your profile to earn badges and track your cognitive growth trajectory.'
                    }
                ],

                uiSectionsTitle: 'Main User Interface Sections',
                uiSections: [
                    {
                        icon: '🏠',
                        name: 'Home Page',
                        desc: 'The gateway presenting project vision, methodology, key statistics, and UNESCO SDG 4 alignment.'
                    },
                    {
                        icon: '🎯',
                        name: 'Challenges Hub',
                        desc: 'Rich library of real-world dilemmas with real-time search, domain filters, and difficulty levels.'
                    },
                    {
                        icon: '💬',
                        name: 'Challenge Session Room',
                        desc: 'Central workspace hosting the 4 phases: Challenge, Socratic Dialogue, Deep Reflection, and Evaluation.'
                    },
                    {
                        icon: '👤',
                        name: 'Student Profile',
                        desc: 'Personal dashboard displaying cumulative averages, radar skill chart, challenge history, and earned badges.'
                    },
                    {
                        icon: '📊',
                        name: 'Teacher Dashboard',
                        desc: 'Dedicated teacher workspace to manage students, monitor class analytics, create custom dilemmas, and manage API settings.'
                    }
                ],

                comparisonTitle: 'Key Difference: How Our Lab Differs from Traditional AI',
                compTradTitle: 'Traditional Generative AI (ChatGPT, etc.)',
                compTradDesc: 'Provides direct, ready-made solutions, leading to:',
                compTradPoints: [
                    '❌ Eliminating learner cognitive effort and fostering mental laziness.',
                    '❌ Accepting generated text uncritically without verification.',
                    '❌ Promoting superficial copy-paste culture.'
                ],
                compLabTitle: 'AI Critical Thinking Lab (Our Socratic Approach)',
                compLabDesc: 'Strictly avoids direct solutions and acts as an intellectual sparring partner:',
                compLabPoints: [
                    '✅ Asks sharp exploratory questions forcing deep causal analysis.',
                    '✅ Introduces counter-perspectives exposing confirmation bias.',
                    '✅ Demands concrete evidence and guides structured reflective writing.'
                ]
            },

            tech: {
                badge: '🤖 Actual AI Technologies Used',
                title: 'AI Tools & Technical Architecture',
                subtitle: 'Strict inventory of technologies and platforms actually implemented and running in the project:',
                items: [
                    {
                        name: 'OpenAI Chat Completions API & Models',
                        version: 'GPT-4o / GPT-4o-mini / GPT-5.2 Series',
                        icon: '🧠',
                        color: 'cyan',
                        purpose: 'Core engine powering Socratic dialogue and rubric academic evaluation',
                        howUsed: 'Deployed in two disciplined modes: first as an interactive Socratic partner constrained by strict instructions against providing answers, and second as an academic evaluator parsing arguments.',
                        valueAdded: 'Provides an expert, 24/7 personal dialogue partner for each student, and an objective evaluator capable of analyzing logical reasoning in seconds.'
                    },
                    {
                        name: 'Structured JSON Mode',
                        version: 'OpenAI JSON Object Response Format',
                        icon: '📋',
                        color: 'purple',
                        purpose: 'Deterministic evaluation outputs eliminating hallucinations',
                        howUsed: 'Directs the AI model to return a validated JSON structure with numerical scores across 4 cognitive skills (0-100), qualitative feedback, strengths, and actionable tips.',
                        valueAdded: 'Guarantees programmatic stability, feeding charts and databases with standardized, error-free values.'
                    },
                    {
                        name: 'Secure Server API Proxy',
                        version: 'ASP.NET Core (Program.cs) & ASP.NET 4.8 (api.ashx)',
                        icon: '🔒',
                        color: 'gold',
                        purpose: 'API key security, institutional token governance, and data persistence',
                        howUsed: 'Acts as a secure backend proxy relaying client requests to OpenAI without exposing API keys in the client browser, while persisting user records in server JSON storage.',
                        valueAdded: 'Ensures enterprise-grade security for school settings while maintaining full flexibility for offline/static deployment.'
                    },
                    {
                        name: 'Chart.js Cognitive Analytics Engine',
                        version: 'Chart.js v4.4.7 (UMD)',
                        icon: '📊',
                        color: 'emerald',
                        purpose: 'Transforming AI assessment metrics into interactive radar diagrams',
                        howUsed: 'Renders the 4-dimensional cognitive skill matrix (Critical Thinking, Creativity, Evidence Quality, Analysis Depth) into intuitive radar and progress charts.',
                        valueAdded: 'Empowers students and educators to identify strengths and developmental gaps visually in seconds.'
                    },
                    {
                        name: 'Dexie.js IndexedDB Client Engine',
                        version: 'Dexie.js v4.0.11 (IndexedDB API Wrapper)',
                        icon: '💾',
                        color: 'rose',
                        purpose: 'Instant offline-first local persistence of sessions and profiles',
                        howUsed: 'Manages an indexed browser-side relational database storing sessions, chat dialogue history, reflections, and earned badges.',
                        valueAdded: 'Zero-latency responsiveness ensuring no student input is lost even during intermittent network connectivity.'
                    }
                ]
            },

            impact: {
                badge: '📈 Educational Transformation & Impact',
                title: 'Impact on Teachers & Students',
                subtitle: 'Radical solution to contemporary educational challenges, elevating teaching and thinking practices:',
                
                problemChallenge: {
                    title: 'The Core Educational Problem Addressed',
                    desc: 'With the explosive rise of generative AI, education faces a crisis of "cognitive atrophy" where students rely on AI to generate ready-made assignments at the click of a button without critical analysis. Concurrently, teachers struggle to evaluate individual critical thinking at scale in crowded classrooms.'
                },

                comparisonGrid: [
                    {
                        title: 'Challenges Before the Project',
                        teacherTitle: 'Before: Teacher Challenges',
                        teacherPoints: [
                            'Dozens of hours weekly consumed by grading essays and writing narrative comments.',
                            'Inability to conduct 1-on-1 Socratic discussions with every student in large classes.',
                            'Difficulty quantifying higher-order thinking (analysis, argumentation, originality) objectively.',
                            'Proliferation of AI copy-pasting without a tool that channels AI toward intellectual growth.'
                        ],
                        studentTitle: 'Before: Student Challenges',
                        studentPoints: [
                            'Habitual consumption of direct answers without analytical effort.',
                            'Reluctance to express non-conventional views due to peer anxiety.',
                            'Vulnerability to confirmation bias without exposure to contrasting perspectives.',
                            'Absence of immediate, granular feedback on argumentation quality and evidence rigor.'
                        ]
                    },
                    {
                        title: 'Transformation After the Project',
                        teacherTitle: 'After: Empowered Teaching Practice',
                        teacherPoints: [
                            'Saving up to 70% of evaluation time with automated, objective rubric reports.',
                            'Transitioning from "content lecturer" to "facilitator of high-level philosophical discourse".',
                            'Access to granular diagnostic data pinpointing individual student reasoning needs.',
                            'Assigning rich critical thinking tasks with confidence that students perform genuine reasoning.'
                        ],
                        studentTitle: 'After: Elevated Student Performance & Agency',
                        studentPoints: [
                            'Developing cognitive flexibility and active practice in questioning assumptions.',
                            'Building disciplined habits of justifying opinions with concrete evidence.',
                            'Enhancing expressive clarity and reflective writing under real-time guidance.',
                            'Strengthened intellectual confidence through badge achievements and visual skill growth.'
                        ]
                    }
                ],

                kpisTitle: 'Key Success Indicators & Metrics',
                kpisSubtitle: 'Educational impact is evaluated through automated, objective quantitative and qualitative metrics:',
                kpis: [
                    {
                        metric: 'Critical Thinking Skill Growth',
                        target: '+25% to +40%',
                        desc: 'Statistical delta between initial and subsequent session scores across critical thinking and evidence rigor.'
                    },
                    {
                        metric: 'Reflection Quality & Depth',
                        target: 'Avg 120+ words with high synthesis',
                        desc: 'Linguistic evaluation assessing counter-argument recognition and depth indicator progression.'
                    },
                    {
                        metric: 'Socratic Dialogue Engagement',
                        target: '4 to 8 active turns',
                        desc: 'Learner engagement depth with AI prompts and usage of "Different View" and "Challenge Me" prompts.'
                    },
                    {
                        metric: 'Teacher Time Efficiency',
                        target: '~70% time saved',
                        desc: 'Reduction in manual essay grading time coupled with enhanced immediacy of personalized student feedback.'
                    }
                ]
            },

            cta: {
                title: 'Ready to Experience the Critical Thinking Lab?',
                subtitle: 'Embark on an intellectual adventure, explore challenges, and engage in high-level Socratic reasoning.',
                startBtn: 'Start First Challenge Now',
                loginBtn: 'Log In as Teacher or Student',
                backToHome: 'Back to Home'
            }
        }
    };

    /**
     * Render the complete About & Guide Page
     */
    function render(container, lang = 'ar') {
        const d = content[lang] || content.ar;
        const isAr = lang === 'ar';

        container.innerHTML = `
            <div class="page-content about-page animate-fadeIn">
                
                <!-- ===== Hero Header ===== -->
                <header class="about-hero">
                    <div class="about-hero-badge">
                        <span>${d.badge}</span>
                    </div>
                    <h1 class="about-hero-title">${d.title}</h1>
                    <p class="about-hero-subtitle">${d.subtitle}</p>

                    <!-- Quick Navigation Bar (Sticky Sub-nav) -->
                    <div class="about-subnav-wrapper" id="aboutSubnavWrapper">
                        <nav class="about-subnav" id="aboutSubnav" aria-label="Sections navigation">
                            ${d.navTabs.map((tab, idx) => `
                                <button type="button" class="about-nav-tab ${idx === 0 ? 'active' : ''}" data-target="${tab.id}">
                                    <span class="tab-icon">${tab.icon}</span>
                                    <span class="tab-label">${tab.label}</span>
                                </button>
                            `).join('')}
                        </nav>
                    </div>
                </header>

                <!-- ===== SECTION 1: Target Audience ===== -->
                <section class="about-section" id="sec-audience">
                    <div class="section-header">
                        <span class="section-badge">${d.audience.badge}</span>
                        <h2 class="section-title">${d.audience.title}</h2>
                        <p class="section-subtitle">${d.audience.subtitle}</p>
                    </div>

                    <div class="audience-grid">
                        ${d.audience.items.map(item => `
                            <article class="audience-card glass-card border-${item.color}">
                                <div class="audience-card-header">
                                    <div class="audience-icon-box bg-${item.color}">
                                        <span class="audience-emoji">${item.icon}</span>
                                    </div>
                                    <div class="audience-meta">
                                        <span class="audience-pill pill-${item.color}">${item.badge}</span>
                                        <h3 class="audience-role">${item.role}</h3>
                                    </div>
                                </div>
                                <p class="audience-desc">${item.desc}</p>
                                <div class="audience-benefits">
                                    <h4 class="benefits-title">${isAr ? 'القيمة المكتسبة والميزات:' : 'Key Benefits & Value:'}</h4>
                                    <ul>
                                        ${item.benefits.map(b => `<li><span class="check-bullet">✓</span> <span>${b}</span></li>`).join('')}
                                    </ul>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </section>

                <!-- ===== SECTION 2: User Guide ===== -->
                <section class="about-section" id="sec-guide">
                    <div class="section-header">
                        <span class="section-badge">${d.guide.badge}</span>
                        <h2 class="section-title">${d.guide.title}</h2>
                        <p class="section-subtitle">${d.guide.subtitle}</p>
                    </div>

                    <!-- Step-by-Step Interactive Timeline -->
                    <div class="guide-steps-timeline">
                        ${d.guide.steps.map(step => `
                            <div class="timeline-step glass-card">
                                <div class="step-badge">${step.number}</div>
                                <div class="step-body">
                                    <h3 class="step-title">${step.title}</h3>
                                    <p class="step-desc">${step.desc}</p>
                                    <div class="step-tip">
                                        <span class="tip-icon">💡</span>
                                        <span class="tip-text">${step.tip}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- UI Sections Cards -->
                    <div class="ui-sections-container">
                        <h3 class="subheading-gradient">${d.guide.uiSectionsTitle}</h3>
                        <div class="ui-sections-grid">
                            ${d.guide.uiSections.map(s => `
                                <div class="ui-section-card glass-card">
                                    <div class="ui-section-icon">${s.icon}</div>
                                    <h4 class="ui-section-name">${s.name}</h4>
                                    <p class="ui-section-desc">${s.desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Comparison Box: Socratic AI vs Traditional AI -->
                    <div class="socratic-comparison-box glass-card">
                        <h3 class="comparison-main-title">${d.guide.comparisonTitle}</h3>
                        <div class="comparison-grid">
                            <div class="comp-col comp-trad">
                                <div class="comp-header">
                                    <span class="comp-icon">🤖</span>
                                    <h4>${d.guide.compTradTitle}</h4>
                                </div>
                                <p class="comp-lead">${d.guide.compTradDesc}</p>
                                <ul class="comp-list">
                                    ${d.guide.compTradPoints.map(p => `<li>${p}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="comp-divider">
                                <span>VS</span>
                            </div>
                            <div class="comp-col comp-lab">
                                <div class="comp-header">
                                    <span class="comp-icon">🧠</span>
                                    <h4>${d.guide.compLabTitle}</h4>
                                </div>
                                <p class="comp-lead">${d.guide.compLabDesc}</p>
                                <ul class="comp-list">
                                    ${d.guide.compLabPoints.map(p => `<li>${p}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===== SECTION 3: AI Tools & Technologies ===== -->
                <section class="about-section" id="sec-tech">
                    <div class="section-header">
                        <span class="section-badge">${d.tech.badge}</span>
                        <h2 class="section-title">${d.tech.title}</h2>
                        <p class="section-subtitle">${d.tech.subtitle}</p>
                    </div>

                    <div class="tech-cards-grid">
                        ${d.tech.items.map(tech => `
                            <article class="tech-card glass-card border-${tech.color}">
                                <div class="tech-card-header">
                                    <div class="tech-icon-box bg-${tech.color}">
                                        <span class="tech-icon">${tech.icon}</span>
                                    </div>
                                    <div class="tech-header-info">
                                        <h3 class="tech-name">${tech.name}</h3>
                                        <span class="tech-version">${tech.version}</span>
                                    </div>
                                </div>

                                <div class="tech-details-grid">
                                    <div class="tech-detail-item">
                                        <div class="detail-label">🎯 ${isAr ? 'الغرض الأساسي:' : 'Primary Purpose:'}</div>
                                        <div class="detail-content">${tech.purpose}</div>
                                    </div>
                                    <div class="tech-detail-item">
                                        <div class="detail-label">⚙️ ${isAr ? 'التوظيف داخل المشروع:' : 'Implementation in Project:'}</div>
                                        <div class="detail-content">${tech.howUsed}</div>
                                    </div>
                                    <div class="tech-detail-item">
                                        <div class="detail-label">💎 ${isAr ? 'القيمة المضافة للمنظومة:' : 'Added Value:'}</div>
                                        <div class="detail-content">${tech.valueAdded}</div>
                                    </div>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </section>

                <!-- ===== SECTION 4: Educational Impact ===== -->
                <section class="about-section" id="sec-impact">
                    <div class="section-header">
                        <span class="section-badge">${d.impact.badge}</span>
                        <h2 class="section-title">${d.impact.title}</h2>
                        <p class="section-subtitle">${d.impact.subtitle}</p>
                    </div>

                    <!-- Core Problem Callout Banner -->
                    <div class="problem-challenge-card glass-card">
                        <div class="problem-icon">⚠️</div>
                        <div class="problem-text">
                            <h3>${d.impact.problemChallenge.title}</h3>
                            <p>${d.impact.problemChallenge.desc}</p>
                        </div>
                    </div>

                    <!-- Impact Comparison: Before vs After -->
                    <div class="impact-comparison-wrapper">
                        ${d.impact.comparisonGrid.map((col, idx) => `
                            <div class="impact-col glass-card ${idx === 1 ? 'impact-after' : 'impact-before'}">
                                <h3 class="impact-col-title ${idx === 1 ? 'text-gradient' : ''}">${col.title}</h3>
                                
                                <div class="impact-subblock">
                                    <h4 class="impact-subblock-title">${col.teacherTitle}</h4>
                                    <ul>
                                        ${col.teacherPoints.map(p => `<li>${idx === 1 ? '✨' : '⚠️'} ${p}</li>`).join('')}
                                    </ul>
                                </div>

                                <div class="impact-subblock">
                                    <h4 class="impact-subblock-title">${col.studentTitle}</h4>
                                    <ul>
                                        ${col.studentPoints.map(p => `<li>${idx === 1 ? '🌟' : '⚠️'} ${p}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- ===== SECTION 5: KPIs & Success Metrics ===== -->
                <section class="about-section" id="sec-kpis">
                    <div class="section-header">
                        <span class="section-badge">🏆 ${isAr ? 'مؤشرات الإنجاز' : 'Key Metrics'}</span>
                        <h2 class="section-title">${d.impact.kpisTitle}</h2>
                        <p class="section-subtitle">${d.impact.kpisSubtitle}</p>
                    </div>

                    <div class="kpis-grid">
                        ${d.impact.kpis.map(kpi => `
                            <div class="kpi-card glass-card">
                                <div class="kpi-target-tag">${kpi.target}</div>
                                <h3 class="kpi-name">${kpi.metric}</h3>
                                <p class="kpi-desc">${kpi.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- ===== Call To Action Footer ===== -->
                <div class="about-cta glass-card">
                    <h2 class="cta-title">${d.cta.title}</h2>
                    <p class="cta-subtitle">${d.cta.subtitle}</p>
                    <div class="cta-actions">
                        <button type="button" class="btn btn-primary btn-lg" id="aboutCtaStart">
                            <span>${d.cta.startBtn}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-secondary btn-lg" id="aboutCtaHome">
                            <span>${d.cta.backToHome}</span>
                        </button>
                    </div>
                </div>

            </div>
        `;

        setupInteractions();
    }

    /**
     * Set up interactions: sticky nav, smooth scroll, tab highlights, CTAs
     */
    function setupInteractions() {
        const subnavButtons = document.querySelectorAll('.about-nav-tab');
        
        subnavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    subnavButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const offset = 90; // Top navbar offset
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetEl.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // CTA Buttons
        const ctaStart = document.getElementById('aboutCtaStart');
        if (ctaStart) {
            ctaStart.addEventListener('click', () => {
                if (typeof App !== 'undefined' && App.navigateTo) {
                    App.navigateTo('challenges');
                }
            });
        }

        const ctaHome = document.getElementById('aboutCtaHome');
        if (ctaHome) {
            ctaHome.addEventListener('click', () => {
                if (typeof App !== 'undefined' && App.navigateTo) {
                    App.navigateTo('home');
                }
            });
        }

        // Active tab detection on scroll
        const sections = ['sec-audience', 'sec-guide', 'sec-tech', 'sec-impact', 'sec-kpis'];
        const onScroll = () => {
            const scrollPos = window.scrollY + 150;
            for (let i = sections.length - 1; i >= 0; i--) {
                const sec = document.getElementById(sections[i]);
                if (sec && sec.offsetTop <= scrollPos) {
                    subnavButtons.forEach(b => {
                        if (b.getAttribute('data-target') === sections[i]) {
                            b.classList.add('active');
                        } else {
                            b.classList.remove('active');
                        }
                    });
                    break;
                }
            }
        };

        window.removeEventListener('scroll', window._aboutScrollHandler);
        window._aboutScrollHandler = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    return {
        render
    };

})();
