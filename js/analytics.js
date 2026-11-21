/* ============================================
   AI Critical Thinking Lab — Analytics & Badges System
   نظام التحليلات، الشارات، ورسم الرسوم البيانية
   ============================================ */

const Analytics = (() => {

    // Define all badges metadata
    const BADGES = {
        first_step: {
            id: 'first_step',
            icon: '🚀',
            nameAr: 'الخطوة الأولى',
            nameEn: 'First Step',
            descAr: 'أكملت أول تحدٍ لك في المختبر',
            descEn: 'Completed your first challenge'
        },
        socratic_master: {
            id: 'socratic_master',
            icon: '🎓',
            nameAr: 'أستاذ سقراط',
            nameEn: 'Socratic Master',
            descAr: 'احصل على درجة 90+ في أي تقييم',
            descEn: 'Scored 90+ in any challenge'
        },
        science_thinker: {
            id: 'science_thinker',
            icon: '🧪',
            nameAr: 'مفكر علمي',
            nameEn: 'Science Thinker',
            descAr: 'أكملت تحدياً في فئة العلوم',
            descEn: 'Completed a challenge in Science'
        },
        ethics_philosopher: {
            id: 'ethics_philosopher',
            icon: '⚖️',
            nameAr: 'فيلسوف أخلاقي',
            nameEn: 'Ethics Philosopher',
            descAr: 'أكملت تحدياً في فئة الأخلاقيات',
            descEn: 'Completed a challenge in Ethics'
        },
        tech_guru: {
            id: 'tech_guru',
            icon: '💻',
            nameAr: 'خبير تقني',
            nameEn: 'Tech Guru',
            descAr: 'أكملت تحدياً في فئة التكنولوجيا',
            descEn: 'Completed a challenge in Technology'
        },
        society_critic: {
            id: 'society_critic',
            icon: '👥',
            nameAr: 'ناقد مجتمعي',
            nameEn: 'Society Critic',
            descAr: 'أكملت تحدياً في فئة المجتمع',
            descEn: 'Completed a challenge in Society'
        },
        eco_warrior: {
            id: 'eco_warrior',
            icon: '🌿',
            nameAr: 'حامي البيئة',
            nameEn: 'Eco Warrior',
            descAr: 'أكملت تحدياً في فئة البيئة',
            descEn: 'Completed a challenge in Environment'
        },
        persistent: {
            id: 'persistent',
            icon: '🔥',
            nameAr: 'المتعلم المثابر',
            nameEn: 'Persistent Learner',
            descAr: 'أكملت 5 تحديات مختلفة',
            descEn: 'Completed 5 challenges'
        }
    };

    /**
     * Get all available badges metadata
     */
    function getBadgesList() {
        return Object.values(BADGES);
    }

    /**
     * Calculate earned badges for a user based on completed sessions
     */
    function checkBadges(sessions, challenges) {
        const earned = new Set();
        const completedSessions = sessions.filter(s => s.completedAt && s.evaluation);
        
        if (completedSessions.length > 0) {
            earned.add('first_step');
        }

        if (completedSessions.length >= 5) {
            earned.add('persistent');
        }

        // Check scores and categories
        completedSessions.forEach(session => {
            const score = session.evaluation.overall || 0;
            if (score >= 90) {
                earned.add('socratic_master');
            }

            // Find category
            const challenge = challenges.find(c => String(c.id) === String(session.challengeId));
            if (challenge) {
                if (challenge.category === 'science') earned.add('science_thinker');
                if (challenge.category === 'ethics') earned.add('ethics_philosopher');
                if (challenge.category === 'technology') earned.add('tech_guru');
                if (challenge.category === 'society') earned.add('society_critic');
                if (challenge.category === 'environment') earned.add('eco_warrior');
            }
        });

        return Array.from(earned);
    }

    /**
     * Get average performance scores from completed sessions
     */
    function calculateAverages(sessions) {
        const completed = sessions.filter(s => s.completedAt && s.evaluation);
        if (completed.length === 0) {
            return {
                criticalThinking: 0,
                creativity: 0,
                evidenceQuality: 0,
                analysisDepth: 0,
                overall: 0
            };
        }

        let totalCt = 0, totalCr = 0, totalEq = 0, totalAd = 0, totalOver = 0;

        completed.forEach(s => {
            const ev = s.evaluation;
            totalCt += ev.critical_thinking || ev.criticalThinking || 0;
            totalCr += ev.creativity || 0;
            totalEq += ev.evidence_quality || ev.evidenceQuality || 0;
            totalAd += ev.analysis_depth || ev.analysisDepth || 0;
            totalOver += ev.overall || 0;
        });

        const count = completed.length;
        return {
            criticalThinking: Math.round(totalCt / count),
            creativity: Math.round(totalCr / count),
            evidenceQuality: Math.round(totalEq / count),
            analysisDepth: Math.round(totalAd / count),
            overall: Math.round(totalOver / count)
        };
    }

    /**
     * Draw Radar Chart for session evaluation or user average profiles
     */
    let activeRadarChart = null;
    function renderRadarChart(canvasId, scores, lang) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Destroy previous chart if it exists
        if (activeRadarChart) {
            activeRadarChart.destroy();
        }

        const isAr = lang === 'ar';
        const labels = isAr 
            ? ['التفكير النقدي', 'الإبداع', 'جودة الأدلة', 'عمق التحليل'] 
            : ['Critical Thinking', 'Creativity', 'Evidence Quality', 'Analysis Depth'];
            
        const datasetLabel = isAr ? 'مستوى المهارة' : 'Skill Level';

        const data = [
            scores.critical_thinking || scores.criticalThinking || 0,
            scores.creativity || 0,
            scores.evidence_quality || scores.evidenceQuality || 0,
            scores.analysis_depth || scores.analysisDepth || 0
        ];

        // Chart styling colors matches CSS Design System
        const primaryColor = '#00d4ff';
        const purpleColor = '#7c3aed';

        activeRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: datasetLabel,
                    data: data,
                    backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    borderColor: primaryColor,
                    pointBackgroundColor: purpleColor,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: primaryColor,
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#a0a0c0',
                            font: {
                                family: isAr ? 'Tajawal' : 'Inter',
                                size: 12,
                                weight: '600'
                            }
                        },
                        ticks: {
                            color: '#6a6a8e',
                            backdropColor: 'transparent',
                            beginAtZero: true,
                            max: 100,
                            stepSize: 20
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        return activeRadarChart;
    }

    /**
     * Draw Line Chart for learning growth over time
     */
    let activeLineChart = null;
    function renderGrowthChart(canvasId, sessions, challenges, lang) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        if (activeLineChart) {
            activeLineChart.destroy();
        }

        const completed = sessions
            .filter(s => s.completedAt && s.evaluation)
            .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

        const isAr = lang === 'ar';
        const labels = completed.map((s, index) => {
            const ch = challenges.find(c => String(c.id) === String(s.challengeId));
            return ch ? (isAr ? ch.titleAr : ch.titleEn) : `T${index + 1}`;
        });

        const data = completed.map(s => s.evaluation.overall || 0);

        activeLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length > 0 ? labels : [isAr ? 'البداية' : 'Start'],
                datasets: [{
                    label: isAr ? 'الدرجة الإجمالية' : 'Overall Score',
                    data: data.length > 0 ? data : [0],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#00d4ff',
                    pointHoverRadius: 6
                }]
            },
            options: {
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#a0a0c0',
                            font: { family: isAr ? 'Tajawal' : 'Inter' }
                        }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#a0a0c0',
                            font: { family: isAr ? 'Tajawal' : 'Inter' }
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        return activeLineChart;
    }

    /**
     * Draw Group Performance Bar Chart (for teacher dashboard)
     */
    let activeDashboardChart = null;
    function renderDashboardBarChart(canvasId, sessions, challenges, lang) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        if (activeDashboardChart) {
            activeDashboardChart.destroy();
        }

        const isAr = lang === 'ar';
        const categories = ['science', 'ethics', 'technology', 'society', 'environment'];
        const categoryLabels = isAr 
            ? ['العلوم', 'الأخلاقيات', 'التكنولوجيا', 'المجتمع', 'البيئة']
            : ['Science', 'Ethics', 'Technology', 'Society', 'Environment'];

        // Group sessions by category and compute average overall score
        const completed = sessions.filter(s => s.completedAt && s.evaluation);
        
        const averages = categories.map(cat => {
            const catSessions = completed.filter(s => {
                const ch = challenges.find(c => String(c.id) === String(s.challengeId));
                return ch && ch.category === cat;
            });
            if (catSessions.length === 0) return 0;
            const sum = catSessions.reduce((acc, s) => acc + (s.evaluation.overall || 0), 0);
            return Math.round(sum / catSessions.length);
        });

        activeDashboardChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: isAr ? 'متوسط أداء الطلاب' : 'Avg Student Score',
                    data: averages,
                    backgroundColor: [
                        'rgba(0, 212, 255, 0.6)',   // Science - Cyan
                        'rgba(124, 58, 237, 0.6)',  // Ethics - Purple
                        'rgba(59, 130, 246, 0.6)',   // Tech - Blue
                        'rgba(245, 158, 11, 0.6)',   // Society - Gold
                        'rgba(16, 185, 129, 0.6)'    // Env - Emerald
                    ],
                    borderColor: [
                        '#00d4ff', '#7c3aed', '#3b82f6', '#f59e0b', '#10b981'
                    ],
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                scales: {
                    x: {
                        grid: { color: 'transparent' },
                        ticks: {
                            color: '#a0a0c0',
                            font: { family: isAr ? 'Tajawal' : 'Inter' }
                        }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#a0a0c0',
                            font: { family: isAr ? 'Tajawal' : 'Inter' }
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        return activeDashboardChart;
    }

    return {
        getBadgesList,
        checkBadges,
        calculateAverages,
        renderRadarChart,
        renderGrowthChart,
        renderDashboardBarChart
    };
})();
