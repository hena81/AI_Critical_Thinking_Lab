/* ============================================
   AI Critical Thinking Lab — Challenge Database
   قاعدة بيانات التحديات (ثنائية اللغة)
   ============================================ */

const Challenges = (() => {
    const list = [
        // Science
        {
            id: 1,
            category: 'science',
            difficulty: 'beginner', // beginner, intermediate, advanced
            titleAr: 'تعديل الجينات البشرية',
            titleEn: 'Human Gene Editing',
            descAr: 'هل يجب أن نستخدم تقنيات مثل CRISPR لتعديل الجينات البشرية للوقاية من الأمراض الوراثية، حتى لو أدى ذلك إلى "أطفال مصممين"؟',
            descEn: 'Should we use technologies like CRISPR to edit human genes to prevent genetic diseases, even if it leads to "designer babies"?',
            questionsAr: [
                'ما هو الفرق الأخلاقي بين علاج الأمراض وتحسين الصفات البشرية؟',
                'كيف سيؤثر هذا التطور على المساواة والعدالة الاجتماعية بين البشر؟',
                'من الذي يجب أن يمتلك الحق في التحكم بقرارات تعديل الجينات؟'
            ],
            questionsEn: [
                'What is the ethical difference between curing diseases and enhancing human traits?',
                'How will this technology affect social equality and justice among humans?',
                'Who should have the authority to control gene editing decisions?'
            ]
        },
        {
            id: 2,
            category: 'science',
            difficulty: 'intermediate',
            titleAr: 'استعمار المريخ',
            titleEn: 'Colonizing Mars',
            descAr: 'هل إنفاق مليارات الدولارات لاستعمار المريخ أمر مبرر أخلاقياً وعلمياً في ظل الأزمات الحادة التي تواجهها الأرض حالياً؟',
            descEn: 'Is spending billions of dollars to colonize Mars ethically and scientifically justified given the acute crises currently facing Earth?',
            questionsAr: [
                'هل من واجبنا إنقاذ البشرية من الفناء بالذهاب للمريخ أم إصلاح الأرض أولاً؟',
                'ما هي التأثيرات البيئية لاستعمار جرم سماوي جديد؟',
                'كيف ستتم إدارة الموارد والقوانين في المستعمرات المريخية الجديدة؟'
            ],
            questionsEn: [
                'Is it our duty to save humanity from extinction by going to Mars, or should we fix Earth first?',
                'What are the environmental impacts of colonizing a new celestial body?',
                'How will resources and laws be managed in new Martian colonies?'
            ]
        },
        {
            id: 3,
            category: 'science',
            difficulty: 'advanced',
            titleAr: 'الحوسبة الكمومية والتشفير',
            titleEn: 'Quantum Computing & Encryption',
            descAr: 'مع تطور الحوسبة الكمومية التي يمكنها كسر التشفير العالمي، هل نحن مقبلون على عصر الفوضى الرقمية الكاملة أم الأمن المطلق؟',
            descEn: 'With the development of quantum computing capable of breaking global encryption, are we heading towards digital chaos or absolute security?',
            questionsAr: [
                'ما الذي سيحدث للاقتصاد العالمي إذا انهارت أنظمة تشفير المعاملات البنكية؟',
                'كيف ستوازن الدول بين الأمن القومي وخصوصية المواطنين في العصر الكمومي؟',
                'هل يمكن اعتبار المعرفة العلمية خطيرة جداً لدرجة تبرر حظرها؟'
            ],
            questionsEn: [
                'What happens to the global economy if banking encryption systems collapse?',
                'How will nations balance national security with citizen privacy in the quantum era?',
                'Can scientific knowledge be considered so dangerous that it justifies being banned?'
            ]
        },

        // Ethics
        {
            id: 4,
            category: 'ethics',
            difficulty: 'beginner',
            titleAr: 'السيارات ذاتية القيادة وقرارات الحياة والموت',
            titleEn: 'Self-Driving Cars & Life-Death Decisions',
            descAr: 'عند حدوث حادث حتمي، كيف يجب برمجة السيارة ذاتية القيادة؟ هل تنقذ الركاب أم تنقذ المارة من الأطفال والمسنين؟',
            descEn: 'In an inevitable accident, how should a self-driving car be programmed? Should it save its passengers or protect pedestrians?',
            questionsAr: [
                'كيف نقيس قيمة الحياة البشرية بناءً على العمر أو العدد؟',
                'هل يجب أن يتحمل مبرمج السيارة المسؤولية الجنائية والأخلاقية عن الحادث؟',
                'هل ستشتري سيارة مبرمجة للتضحية بك إذا تطلب الأمر إنقاذ الآخرين؟'
            ],
            questionsEn: [
                'How do we measure the value of human life based on age or numbers?',
                'Should the programmer of the car bear criminal and ethical responsibility for accidents?',
                'Would you buy a car programmed to sacrifice you if it meant saving others?'
            ]
        },
        {
            id: 5,
            category: 'ethics',
            difficulty: 'intermediate',
            titleAr: 'الذكاء الاصطناعي التوليدي والملكية الفكرية',
            titleEn: 'Generative AI & Intellectual Property',
            descAr: 'تقوم نماذج الذكاء الاصطناعي بالتدرب على ملايين اللوحات والكتب الفنية دون إذن مبدعيها. هل هذا سرقة أم تطور إبداعي؟',
            descEn: 'Generative AI models train on millions of artworks and books without creators\' permission. Is this theft or creative evolution?',
            questionsAr: [
                'هل يختلف تعلم الآلة عن إلهام الفنان البشري من أعمال الآخرين؟',
                'كيف يمكننا حماية حقوق الفنانين دون إيقاف تطور التكنولوجيا؟',
                'إذا كان الفن نتاج خوارزمية، فمن يملك حقوق نشره وبيع منتجاته؟'
            ],
            questionsEn: [
                'Is machine training different from a human artist being inspired by others\' work?',
                'How can we protect artists\' rights without halting technological progress?',
                'If art is the product of an algorithm, who owns the copyrights and sales?'
            ]
        },
        {
            id: 6,
            category: 'ethics',
            difficulty: 'advanced',
            titleAr: 'تخليد الوعي الرقمي',
            titleEn: 'Digital Consciousness & Immortality',
            descAr: 'إذا تمكنا مستقبلاً من تحميل وعي الإنسان بالكامل على خادم حاسوبي بعد وفاته، فهل هذا الشخص المستنسخ رقمياً حيّ حقاً وله حقوق بشرية؟',
            descEn: 'If we can upload human consciousness to a computer server after death, is this digitally cloned person truly alive, and do they have human rights?',
            questionsAr: [
                'ما الذي يحدد هوية الإنسان: الجسد المادي أم نمط الأفكار والوعي؟',
                'هل يمتلك الكائن الرقمي حقوقاً مثل حق الميراث، أو حق التوقف عن العمل (الإغلاق)؟',
                'كيف سيؤثر التخليد الرقمي على معنى الحياة والموت والعلاقات الإنسانية؟'
            ],
            questionsEn: [
                'What defines human identity: the physical body or the pattern of thoughts and consciousness?',
                'Does a digital being possess rights like inheritance or the right to be shut down?',
                'How will digital immortality affect the meaning of life, death, and human relationships?'
            ]
        },

        // Technology
        {
            id: 7,
            category: 'technology',
            difficulty: 'beginner',
            titleAr: 'إدمان وسائل التواصل الاجتماعي',
            titleEn: 'Social Media Addiction',
            descAr: 'تصمم منصات التواصل الاجتماعي خوارزمياتها لإبقائنا مدمنين على الشاشات. هل تقع المسؤولية على الفرد أم على الشركات المصممة؟',
            descEn: 'Social media platforms design their algorithms to keep us hooked. Does the responsibility lie with the individual or the tech companies?',
            questionsAr: [
                'كيف يؤثر نظام المكافأة الدوباميني في دماغنا على قرارات التصفح اليومية؟',
                'هل يجب على الحكومات فرض قيود وقوانين على تصميم هذه الخوارزميات؟',
                'ما هو الثمن الخفي للمنصات المجانية التي نستخدمها يومياً؟'
            ],
            questionsEn: [
                'How does the dopamine reward system in our brain affect our daily scrolling choices?',
                'Should governments regulate the design of these persuasive algorithms?',
                'What is the hidden cost of the "free" platforms we use every day?'
            ]
        },
        {
            id: 8,
            category: 'technology',
            difficulty: 'intermediate',
            titleAr: 'المراقبة الجماهيرية وتتبع الوجه',
            titleEn: 'Mass Surveillance & Facial Recognition',
            descAr: 'تستخدم بعض الحكومات تقنيات التعرف على الوجوه في الشوارع لمكافحة الجريمة. هل نضحي بالخصوصية الكاملة من أجل الأمن المطلق؟',
            descEn: 'Some governments use facial recognition in streets to combat crime. Should we sacrifice privacy for absolute safety?',
            questionsAr: [
                'هل تشعر بالأمان أم بالتهديد عندما تعلم أنك مراقب طوال الوقت؟',
                'كيف يمكن للأنظمة منع إساءة استخدام هذه البيانات من قبل الحكومات أو المخترقين؟',
                'هل هناك فرق بين المراقبة التقليدية عبر رجال الشرطة والمراقبة الخوارزمية المستمرة؟'
            ],
            questionsEn: [
                'Do you feel safe or threatened knowing that you are monitored at all times?',
                'How can systems prevent abuse of this data by authorities or hackers?',
                'Is there a difference between traditional policing and continuous algorithmic surveillance?'
            ]
        },
        {
            id: 9,
            category: 'technology',
            difficulty: 'advanced',
            titleAr: 'الذكاء الاصطناعي العام (AGI)',
            titleEn: 'Artificial General Intelligence (AGI)',
            descAr: 'عندما نطور ذكاءً اصطناعياً يفوق الذكاء البشري في شتى المجالات، كيف يمكننا التأكد من بقائه متوافقاً مع أهداف وقيم الإنسانية؟',
            descEn: 'When we develop AI that surpasses human intelligence in all domains, how can we ensure it remains aligned with human values and goals?',
            questionsAr: [
                'هل من الممكن لذكاء أدنى (البشر) أن يسيطر أو يوجه ذكاءً أعلى (AGI)؟',
                'ماذا ستفعل البشرية إذا أصبحت جميع الوظائف الذهنية والجسدية تدار بالآلة؟',
                'كيف نضمن ألا تسيطر جهة واحدة أو شركة على هذه التكنولوجيا الفائقة؟'
            ],
            questionsEn: [
                'Is it possible for a lesser intelligence (humans) to control or direct a superior one (AGI)?',
                'What will humanity do when all mental and physical work is performed by machines?',
                'How do we ensure that a single entity or company does not monopolize this super-technology?'
            ]
        },

        // Society
        {
            id: 10,
            category: 'society',
            difficulty: 'beginner',
            titleAr: 'التعليم التقليدي مقابل التعليم الذاتي الرقمي',
            titleEn: 'Traditional vs. Digital Self-Education',
            descAr: 'مع توفر كورسات مجانية من أقوى جامعات العالم ويوتيوب والذكاء الاصطناعي، هل ما زالت الشهادة الجامعية التقليدية ضرورية؟',
            descEn: 'With free courses from top universities, YouTube, and AI, is a traditional university degree still necessary?',
            questionsAr: [
                'ما هي القيمة الحقيقية للجامعة: الشهادة الورقية، أم البيئة الاجتماعية والشبكة المهنية؟',
                'كيف سيؤثر التعليم الذاتي على الفجوة الاقتصادية بين الأغنياء والفقراء؟',
                'هل يمتلك جميع المتعلمين الانضباط الذاتي الكافي للتعلم بشكل مستقل تماماً؟'
            ],
            questionsEn: [
                'What is the true value of university: the degree certificate, or the social environment and networking?',
                'How will self-education impact the economic gap between rich and poor?',
                'Do all learners possess the self-discipline required to learn completely independently?'
            ]
        },
        {
            id: 11,
            category: 'society',
            difficulty: 'intermediate',
            titleAr: 'تأثير الأخبار المزيفة والتزييف العميق',
            titleEn: 'Fake News & Deepfakes Impact',
            descAr: 'يستطيع التزييف العميق فبركة مقاطع فيديو لقادة سياسيين يصفون حرباً أو أفعالاً مخزية. كيف سنثق بأي محتوى مرئي مستقبلاً؟',
            descEn: 'Deepfakes can fabricate video clips of political leaders declaring war or committing shameful acts. How can we trust any visual content in the future?',
            questionsAr: [
                'إذا كان الفرد لا يثق بما يراه ويسمعه، فكيف سيؤثر ذلك على الديمقراطية واستقرار الدول؟',
                'ما هي الآليات التقنية والفكرية التي تمكننا من تمييز الحقيقة عن التزييف؟',
                'من المسؤول عن مكافحة التزييف العميق: منصات النشر، أم الحكومات، أم الفرد المتلقي؟'
            ],
            questionsEn: [
                'If individuals cannot trust what they see and hear, how will this affect democracy and state stability?',
                'What technical and intellectual mechanisms can help us distinguish truth from falsehood?',
                'Who is responsible for fighting deepfakes: publishing platforms, governments, or the consumer?'
            ]
        },
        {
            id: 12,
            category: 'society',
            difficulty: 'advanced',
            titleAr: 'الدخل الأساسي الشامل (UBI)',
            titleEn: 'Universal Basic Income (UBI)',
            descAr: 'لمواجهة البطالة الناتجة عن الأتمتة، يقترح البعض منح كل مواطن راتباً شهرياً ثابتاً دون شروط. هل هذا سينهي الفقر أم يدمر الحافز للعمل؟',
            descEn: 'To counter unemployment caused by automation, some propose giving every citizen a guaranteed monthly income. Will this end poverty or destroy the incentive to work?',
            questionsAr: [
                'كيف سيقضي الناس أوقاتهم إذا لم يكن العمل مصدراً للبقاء وتأمين المعيشة؟',
                'من أين ستمول الحكومات هذا الدخل في ظل تراجع ضرائب العمال المسرَّحين؟',
                'هل يعتمد تقدير الذات الإنسانية على الوظيفة والإنتاجية الاقتصادية؟'
            ],
            questionsEn: [
                'How will people spend their time if work is no longer a prerequisite for survival?',
                'Where will governments fund this income as taxes from laid-off workers decrease?',
                'Does human self-worth depend on employment and economic productivity?'
            ]
        },

        // Environment
        {
            id: 13,
            category: 'environment',
            difficulty: 'beginner',
            titleAr: 'حظر البلاستيك أحادي الاستخدام',
            titleEn: 'Banning Single-Use Plastics',
            descAr: 'هل يجب حظر الأكياس والمستلزمات البلاستيكية تماماً فوراً، على الرغم من الأضرار الاقتصادية الكبيرة على قطاع الصناعة والتجارة؟',
            descEn: 'Should single-use plastics be banned completely and immediately, despite significant economic damage to the manufacturing and retail sectors?',
            questionsAr: [
                'كيف نزن الضرر البيئي طويل المدى مقابل التسهيلات الاقتصادية قصيرة المدى؟',
                'ما هي البدائل العملية المتاحة للجميع وهل هي بمتناول الجميع مادياً؟',
                'هل المسؤولية الكبرى تقع على عاتق المستهلك الفردي أم المصانع الكبرى؟'
            ],
            questionsEn: [
                'How do we weigh long-term environmental damage against short-term economic convenience?',
                'What practical alternatives are available to everyone, and are they financially accessible?',
                'Does the primary responsibility lie with the individual consumer or massive factories?'
            ]
        },
        {
            id: 14,
            category: 'environment',
            difficulty: 'intermediate',
            titleAr: 'ضريبة الكربون على الشركات والأفراد',
            titleEn: 'Carbon Tax on Corporations & Individuals',
            descAr: 'فرض غرامات مالية مرتفعة على كل طن كربون ينبعث من المصانع أو المركبات. هل هذا حماية للبيئة أم استنزاف لجيوب المواطنين؟',
            descEn: 'Imposing high financial fines on every ton of carbon emitted by factories or vehicles. Is this protecting the environment or draining citizens\' pockets?',
            questionsAr: [
                'كيف ستنعكس ضرائب المصانع على أسعار السلع الغذائية والأساسية للمستهلك البسيط؟',
                'هل من العدل فرض ضرائب كربون متساوية بين الدول النامية والدول المتقدمة صناعياً؟',
                'هل الحوافز الاقتصادية الإيجابية (الإعفاءات) أجدى من العقوبات المالية (الضرائب)؟'
            ],
            questionsEn: [
                'How will factory carbon taxes reflect on the prices of food and basic goods for average consumers?',
                'Is it fair to impose equal carbon taxes on developing and highly industrialized nations?',
                'Are positive economic incentives (tax cuts) more effective than financial penalties (taxes)?'
            ]
        },
        {
            id: 15,
            category: 'environment',
            difficulty: 'advanced',
            titleAr: 'الهندسة الجيولوجية المناخية',
            titleEn: 'Climate Geoengineering',
            descAr: 'يقترح بعض العلماء رش جزيئات عاكسة للضوء في الغلاف الجوي لتقليل أشعة الشمس وخفض حرارة الأرض. هل هذا إنقاذ للمناخ أم لعب بالنار؟',
            descEn: 'Some scientists suggest spraying reflective particles into the atmosphere to block sunlight and cool Earth. Is this climate salvation or playing with fire?',
            questionsAr: [
                'ما هي الآثار الجانبية غير المتوقعة لتغيير ديناميكيات الغلاف الجوي للأرض؟',
                'من الذي يمتلك الصلاحية العالمية لاتخاذ قرار بتعديل مناخ كوكب بأكمله؟',
                'هل الاعتماد على التكنولوجيا لتبريد الأرض سيلهينا عن علاج أصل المشكلة (الانبعاثات)؟'
            ],
            questionsEn: [
                'What are the unpredictable side effects of changing the dynamics of Earth\'s atmosphere?',
                'Who has the global authority to make decisions on modifying the climate of an entire planet?',
                'Will relying on technology to cool Earth distract us from treating the root cause (emissions)?'
            ]
        }
    ];

    /**
     * Get all challenges (static + custom from database)
     */
    async function getAll() {
        try {
            const row = await db.settings.get('deleted_challenges');
            const deleted = row ? JSON.parse(row.value) : [];

            const custom = await db.customChallenges.toArray();
            // Map custom challenges to the correct schema
            const customMapped = custom.map(c => ({
                id: `custom_${c.id}`,
                category: c.category,
                difficulty: c.difficulty,
                titleAr: c.titleAr,
                titleEn: c.titleEn,
                descAr: c.descAr,
                descEn: c.descEn,
                questionsAr: typeof c.questionsAr === 'string' ? JSON.parse(c.questionsAr) : c.questionsAr || [],
                questionsEn: typeof c.questionsEn === 'string' ? JSON.parse(c.questionsEn) : c.questionsEn || [],
                isCustom: true
            }));
            const all = [...list, ...customMapped];
            return all.filter(c => !deleted.includes(String(c.id)));
        } catch (e) {
            console.error('Error fetching custom challenges, returning static list: ', e);
            return list;
        }
    }

    /**
     * Get single challenge by ID
     */
    async function getById(id) {
        try {
            const row = await db.settings.get('deleted_challenges');
            const deleted = row ? JSON.parse(row.value) : [];
            if (deleted.includes(String(id))) return null;

            if (typeof id === 'string' && id.startsWith('custom_')) {
                const dbId = parseInt(id.replace('custom_', ''), 10);
                const c = await db.customChallenges.get(dbId);
                if (c) {
                    return {
                        id: id,
                        category: c.category,
                        difficulty: c.difficulty,
                        titleAr: c.titleAr,
                        titleEn: c.titleEn,
                        descAr: c.descAr,
                        descEn: c.descEn,
                        questionsAr: typeof c.questionsAr === 'string' ? JSON.parse(c.questionsAr) : c.questionsAr || [],
                        questionsEn: typeof c.questionsEn === 'string' ? JSON.parse(c.questionsEn) : c.questionsEn || [],
                        isCustom: true
                    };
                }
            }
            return list.find(c => String(c.id) === String(id)) || null;
        } catch (e) {
            console.error('Error getting challenge by id:', e);
            return list.find(c => String(c.id) === String(id)) || null;
        }
    }

    /**
     * Delete a challenge (either custom from DB or static via setting)
     */
    async function deleteChallenge(id) {
        if (typeof id === 'string' && id.startsWith('custom_')) {
            const dbId = parseInt(id.replace('custom_', ''), 10);
            await db.customChallenges.delete(dbId);
        } else {
            const row = await db.settings.get('deleted_challenges');
            let deleted = row ? JSON.parse(row.value) : [];
            if (!deleted.includes(String(id))) {
                deleted.push(String(id));
                await db.settings.put({ key: 'deleted_challenges', value: JSON.stringify(deleted) });
            }
        }
    }

    return {
        getAll,
        getById,
        deleteChallenge
    };
})();
