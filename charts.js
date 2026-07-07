class ChartsManager {
    constructor() {
        this.charts = {};
        this.chartColors = {
            cyan: '#00d4ff',
            green: '#10b981',
            red: '#ef4444',
            orange: '#f97316',
            purple: '#a855f7',
            blue: '#3b82f6',
            pink: '#ec4899',
            yellow: '#eab308'
        };
    }

    getChartConfig(type, labels, data, label) {
        const baseConfig = {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: this.chartColors.cyan,
                    backgroundColor: this.getBackgroundColor(type),
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.chartColors.cyan,
                    pointBorderColor: '#1a3a52',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12,
                                weight: '500'
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            family: "'Poppins', sans-serif",
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 212, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return baseConfig;
    }

    getBackgroundColor(type) {
        if (type === 'line') {
            return 'rgba(0, 212, 255, 0.1)';
        } else if (type === 'bar' || type === 'horizontalBar') {
            return 'rgba(0, 212, 255, 0.3)';
        } else if (type === 'doughnut' || type === 'pie') {
            return [
                'rgba(0, 212, 255, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(249, 115, 22, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(234, 179, 8, 0.8)'
            ];
        }
        return 'rgba(0, 212, 255, 0.3)';
    }

    createAttendanceByDayChart(data) {
        const ctx = document.getElementById('chartAttendanceByDay');
        if (!ctx) return;

        const labels = Object.keys(data).sort();
        const values = labels.map(label => data[label]);

        if (this.charts.attendanceByDay) {
            this.charts.attendanceByDay.destroy();
        }

        const config = this.getChartConfig('bar', labels, values, 'Atendimentos');
        this.charts.attendanceByDay = new Chart(ctx, config);
    }

    createWeeklyEvolutionChart(data) {
        const ctx = document.getElementById('chartWeeklyEvolution');
        if (!ctx) return;

        const labels = Object.keys(data).sort();
        const values = labels.map(label => data[label]);

        if (this.charts.weeklyEvolution) {
            this.charts.weeklyEvolution.destroy();
        }

        const config = this.getChartConfig('line', labels, values, 'Evolução Semanal');
        this.charts.weeklyEvolution = new Chart(ctx, config);
    }

    createAttendanceTypesChart(data) {
        const ctx = document.getElementById('chartAttendanceTypes');
        if (!ctx) return;

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (this.charts.attendanceTypes) {
            this.charts.attendanceTypes.destroy();
        }

        const config = {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: this.getBackgroundColor('doughnut'),
                    borderColor: '#1a3a52',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11,
                                weight: '500'
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.attendanceTypes = new Chart(ctx, config);
    }

    createCSVsSupportChart(csCount, supportCount) {
        const ctx = document.getElementById('chartCSVsSupport');
        if (!ctx) return;

        if (this.charts.csVsSupport) {
            this.charts.csVsSupport.destroy();
        }

        const config = {
            type: 'doughnut',
            data: {
                labels: ['Customer Success', 'Suporte'],
                datasets: [{
                    data: [csCount, supportCount],
                    backgroundColor: [
                        'rgba(0, 212, 255, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: '#1a3a52',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11,
                                weight: '500'
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const total = csCount + supportCount;
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.csVsSupport = new Chart(ctx, config);
    }

    createCompanyRankingChart(data) {
        const ctx = document.getElementById('chartCompanyRanking');
        if (!ctx) return;

        const sorted = Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = sorted.map(item => item[0]);
        const values = sorted.map(item => item[1]);

        if (this.charts.companyRanking) {
            this.charts.companyRanking.destroy();
        }

        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Atendimentos',
                    data: values,
                    backgroundColor: 'rgba(0, 212, 255, 0.3)',
                    borderColor: '#00d4ff',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 212, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 10
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 10
                            }
                        }
                    }
                }
            }
        };

        this.charts.companyRanking = new Chart(ctx, config);
    }

    createStateRankingChart(data) {
        const ctx = document.getElementById('chartStateRanking');
        if (!ctx) return;

        const sorted = Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = sorted.map(item => item[0]);
        const values = sorted.map(item => item[1]);

        if (this.charts.stateRanking) {
            this.charts.stateRanking.destroy();
        }

        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Atendimentos',
                    data: values,
                    backgroundColor: 'rgba(0, 212, 255, 0.3)',
                    borderColor: '#00d4ff',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 212, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 10
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 10
                            }
                        }
                    }
                }
            }
        };

        this.charts.stateRanking = new Chart(ctx, config);
    }

    createTechnicianTicketsChart(data) {
        const ctx = document.getElementById('chartTechnicianTickets');
        if (!ctx) return;

        const sorted = Object.entries(data)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10);

        const labels = sorted.map(item => item[0]);
        const values = sorted.map(item => item[1].total);

        if (this.charts.technicianTickets) {
            this.charts.technicianTickets.destroy();
        }

        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Chamados',
                    data: values,
                    backgroundColor: 'rgba(0, 212, 255, 0.3)',
                    borderColor: '#00d4ff',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 212, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 10
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b8c1',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 10
                            }
                        }
                    }
                }
            }
        };

        this.charts.technicianTickets = new Chart(ctx, config);
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

const chartsManager = new ChartsManager();
