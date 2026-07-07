class DataProcessor {
    constructor() {
        this.rawData = [];
        this.filteredData = [];
        this.filters = {
            week: '',
            month: '',
            state: '',
            company: '',
            system: '',
            team: '',
            status: '',
            type: '',
            search: ''
        };
    }

    loadData(data) {
        // Filtrar registros vazios
        const validData = data.filter(row => row['Protocolo'] && row['Protocolo'].trim());
        
        this.detectTeamColumn(validData);
        this.rawData = validData.map(row => ({
            ...row,
            'Data de abertura': this.parseDate(row['Data de abertura']),
            'Data de fechamento': row['Data de fechamento'] ? this.parseDate(row['Data de fechamento']) : null
        }));
        this.filteredData = [...this.rawData];
        this.updateLastModified();
        return this.rawData;
    }

    detectTeamColumn(data) {
        if (data.length === 0) return;
        const firstRow = data[0];
        this.teamColumn = firstRow['Equpe'] !== undefined ? 'Equpe' : 'Equipe';
    }

    parseDate(dateStr) {
        if (!dateStr) return null;
        
        const cleanStr = dateStr.toString().trim().split('\n')[0];
        
        const formats = [
            /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
            /(\d{4})-(\d{2})-(\d{2})/,
            /(\d{1,2})-(\d{1,2})-(\d{4})/
        ];

        for (let format of formats) {
            const match = cleanStr.match(format);
            if (match) {
                if (format === formats[0]) {
                    return new Date(match[3], match[2] - 1, match[1]);
                } else if (format === formats[1]) {
                    return new Date(match[1], match[2] - 1, match[3]);
                } else {
                    return new Date(match[3], match[2] - 1, match[1]);
                }
            }
        }
        return null;
    }

    applyFilters(filters) {
        this.filters = filters;
        this.filteredData = this.rawData.filter(row => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const searchMatch = 
                    (row['Protocolo'] && row['Protocolo'].toString().toLowerCase().includes(searchLower)) ||
                    (row['Cliente'] && row['Cliente'].toString().toLowerCase().includes(searchLower)) ||
                    (row['Empresa do cliente'] && row['Empresa do cliente'].toString().toLowerCase().includes(searchLower));
                if (!searchMatch) return false;
            }

            if (filters.week && !this.isInWeek(row['Data de abertura'], filters.week)) return false;
            if (filters.month && !this.isInMonth(row['Data de abertura'], filters.month)) return false;
            if (filters.state && row['Estado'] !== filters.state) return false;
            if (filters.company && row['Empresa do cliente'] !== filters.company) return false;
            if (filters.system && row['Sistema(s)'] !== filters.system) return false;
            if (filters.team) {
                const teamValue = row[this.teamColumn] || row['Equpe'] || row['Equipe'] || '';
                if (teamValue !== filters.team) return false;
            }
            if (filters.status && row['Status'] !== filters.status) return false;
            if (filters.type && row['Tipo'] !== filters.type) return false;

            return true;
        });

        return this.filteredData;
    }

    isInWeek(date, weekStr) {
        if (!date) return false;
        const [year, week] = weekStr.split('-W');
        const d = new Date(date);
        const yearMatch = d.getFullYear().toString() === year;
        const weekNum = this.getWeekNumber(d);
        return yearMatch && weekNum.toString() === week;
    }

    isInMonth(date, monthStr) {
        if (!date) return false;
        const [year, month] = monthStr.split('-');
        return date.getFullYear().toString() === year && 
               (date.getMonth() + 1).toString().padStart(2, '0') === month;
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    getUniqueValues(column) {
        return [...new Set(this.rawData
            .map(row => row[column])
            .filter(val => val && val.toString().trim() !== ''))
        ].sort();
    }

    getWeeks() {
        const weeks = new Set();
        this.rawData.forEach(row => {
            if (row['Data de abertura']) {
                const year = row['Data de abertura'].getFullYear();
                const week = this.getWeekNumber(row['Data de abertura']);
                weeks.add(`${year}-W${week.toString().padStart(2, '0')}`);
            }
        });
        return Array.from(weeks).sort();
    }

    getMonths() {
        const months = new Set();
        this.rawData.forEach(row => {
            if (row['Data de abertura']) {
                const year = row['Data de abertura'].getFullYear();
                const month = (row['Data de abertura'].getMonth() + 1).toString().padStart(2, '0');
                months.add(`${year}-${month}`);
            }
        });
        return Array.from(months).sort();
    }

    getCSAttendances() {
        return this.filteredData.filter(row => {
            const equipe = (row['Equpe'] || row['Equipe'] || '').toLowerCase().trim();
            return equipe === 'cs';
        });
    }

    getSupportTickets() {
        return this.filteredData.filter(row => {
            const equipe = (row['Equpe'] || row['Equipe'] || '').toLowerCase().trim();
            return equipe === 'suporte';
        });
    }

    getCallsCount() {
        return this.filteredData.filter(row => {
            const tipo = (row['Tipo'] || '').toLowerCase().trim();
            return tipo === 'ligação';
        }).length;
    }

    getMeetingsCount() {
        return this.filteredData.filter(row => {
            const tipo = (row['Tipo'] || '').toLowerCase().trim();
            return tipo === 'reunião';
        }).length;
    }

    getOpenTickets() {
        return this.filteredData.filter(row => {
            const status = (row['Status'] || '').toLowerCase();
            return status.includes('atendimento');
        });
    }

    getClosedTickets() {
        return this.filteredData.filter(row => {
            const status = (row['Status'] || '').toLowerCase();
            return status.includes('resolvido');
        });
    }

    getTicketsByDay() {
        const days = {};
        this.filteredData.forEach(row => {
            if (row['Data de abertura']) {
                const dateStr = row['Data de abertura'].toLocaleDateString('pt-BR');
                days[dateStr] = (days[dateStr] || 0) + 1;
            }
        });
        return days;
    }

    getTicketsByType() {
        const types = {};
        this.filteredData.forEach(row => {
            const type = row['Tipo'] || 'Não especificado';
            types[type] = (types[type] || 0) + 1;
        });
        return types;
    }

    getTicketsByCompany() {
        const companies = {};
        this.filteredData.forEach(row => {
            const company = row['Empresa do cliente'] || 'Não especificado';
            companies[company] = (companies[company] || 0) + 1;
        });
        return companies;
    }

    getTicketsByState() {
        const states = {};
        this.filteredData.forEach(row => {
            const state = row['Estado'] || 'Não especificado';
            states[state] = (states[state] || 0) + 1;
        });
        return states;
    }

    getTicketsByTechnician() {
        const technicians = {};
        this.filteredData.forEach(row => {
            const tech = row['Técnico responsável'] || 'Não atribuído';
            if (!technicians[tech]) {
                technicians[tech] = { total: 0, resolved: 0 };
            }
            technicians[tech].total++;
            if (row['Data de fechamento']) {
                technicians[tech].resolved++;
            }
        });
        return technicians;
    }

    getSystemsUsage() {
        const systems = {};
        this.filteredData.forEach(row => {
            const sys = row['Sistema(s)'] || 'Não especificado';
            systems[sys] = (systems[sys] || 0) + 1;
        });
        return systems;
    }

    getConversionRate() {
        const csCount = this.getCSAttendances().length;
        const supportCount = this.getSupportTickets().length;
        if (csCount === 0) return 0;
        return ((supportCount / csCount) * 100).toFixed(2);
    }

    getAverageDaysToResolve() {
        const closedTickets = this.getClosedTickets();
        if (closedTickets.length === 0) return 0;
        
        const totalDays = closedTickets.reduce((sum, ticket) => {
            const start = ticket['Data de abertura'];
            const end = ticket['Data de fechamento'];
            if (start && end) {
                const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                return sum + days;
            }
            return sum;
        }, 0);

        return (totalDays / closedTickets.length).toFixed(1);
    }

    getWeeklyGrowth() {
        const currentWeekData = this.filteredData.filter(row => {
            if (!row['Data de abertura']) return false;
            const currentDate = new Date();
            const currentWeek = this.getWeekNumber(currentDate);
            const currentYear = currentDate.getFullYear();
            const rowWeek = this.getWeekNumber(row['Data de abertura']);
            const rowYear = row['Data de abertura'].getFullYear();
            return rowYear === currentYear && rowWeek === currentWeek;
        });

        const previousWeekData = this.filteredData.filter(row => {
            if (!row['Data de abertura']) return false;
            const currentDate = new Date();
            const previousDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            const previousWeek = this.getWeekNumber(previousDate);
            const previousYear = previousDate.getFullYear();
            const rowWeek = this.getWeekNumber(row['Data de abertura']);
            const rowYear = row['Data de abertura'].getFullYear();
            return rowYear === previousYear && rowWeek === previousWeek;
        });

        if (previousWeekData.length === 0) return 0;
        const growth = ((currentWeekData.length - previousWeekData.length) / previousWeekData.length) * 100;
        return growth.toFixed(2);
    }

    getTicketsOverSevenDays() {
        const now = new Date();
        return this.getOpenTickets().filter(ticket => {
            if (!ticket['Data de abertura']) return false;
            const daysOpen = Math.floor((now - ticket['Data de abertura']) / (1000 * 60 * 60 * 24));
            return daysOpen > 7;
        });
    }

    getTicketsWithoutTechnician() {
        return this.filteredData.filter(row => 
            !row['Técnico responsável'] || row['Técnico responsável'].toString().trim() === ''
        );
    }

    getTicketsWithoutCity() {
        return this.filteredData.filter(row => 
            !row['Cidade'] || row['Cidade'].toString().trim() === ''
        );
    }

    getClientsWithMostTickets() {
        const clients = {};
        this.filteredData.forEach(row => {
            const client = row['Cliente'] || 'Não especificado';
            if (!clients[client]) {
                clients[client] = {
                    count: 0,
                    company: row['Empresa do cliente'] || 'N/A'
                };
            }
            clients[client].count++;
        });

        return Object.entries(clients)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    getHeatmapData() {
        const heatmap = {};
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        
        this.filteredData.forEach(row => {
            if (row['Data de abertura']) {
                const dayName = dayNames[row['Data de abertura'].getDay()];
                heatmap[dayName] = (heatmap[dayName] || 0) + 1;
            }
        });

        return heatmap;
    }

    getTimelineData() {
        return this.filteredData
            .filter(row => row['Data de abertura'])
            .sort((a, b) => b['Data de abertura'] - a['Data de abertura'])
            .slice(0, 20);
    }

    getUniqueClients() {
        return [...new Set(this.filteredData
            .map(row => row['Cliente'])
            .filter(val => val && val.toString().trim() !== ''))
        ].length;
    }

    getUniqueStates() {
        return [...new Set(this.filteredData
            .map(row => row['Estado'])
            .filter(val => val && val.toString().trim() !== ''))
        ].length;
    }

    getUniqueCompanies() {
        return [...new Set(this.filteredData
            .map(row => row['Empresa do cliente'])
            .filter(val => val && val.toString().trim() !== ''))
        ].length;
    }

    getUniqueTechnicians() {
        return [...new Set(this.filteredData
            .map(row => row['Técnico responsável'])
            .filter(val => val && val.toString().trim() !== ''))
        ].length;
    }

    getMostUsedSystem() {
        const systems = this.getSystemsUsage();
        if (Object.keys(systems).length === 0) return 'N/A';
        return Object.entries(systems)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    getAttendancesByDay() {
        const days = {};
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        
        this.filteredData.forEach(row => {
            if (row['Data de abertura']) {
                const dayName = dayNames[row['Data de abertura'].getDay()];
                days[dayName] = (days[dayName] || 0) + 1;
            }
        });

        return days;
    }

    getAverageAttendancesPerDay() {
        const days = this.getAttendancesByDay();
        if (Object.keys(days).length === 0) return 0;
        const total = Object.values(days).reduce((a, b) => a + b, 0);
        return (total / Object.keys(days).length).toFixed(1);
    }

    getAverageTicketsPerDay() {
        const ticketsByDay = this.getTicketsByDay();
        if (Object.keys(ticketsByDay).length === 0) return 0;
        const total = Object.values(ticketsByDay).reduce((a, b) => a + b, 0);
        return (total / Object.keys(ticketsByDay).length).toFixed(1);
    }

    updateLastModified() {
        const now = new Date();
        localStorage.setItem('lastUpdate', now.toLocaleTimeString('pt-BR'));
    }

    getLastModified() {
        return localStorage.getItem('lastUpdate') || '--:--';
    }

    generateExecutiveSummary() {
        const csCount = this.getCSAttendances().length;
        const supportCount = this.getSupportTickets().length;
        const openCount = this.getOpenTickets().length;
        const closedCount = this.getClosedTickets().length;
        const callsCount = this.getCallsCount();
        const meetingsCount = this.getMeetingsCount();
        const topState = this.getTopState();
        const topCompany = this.getTopCompany();
        const totalTickets = this.filteredData.length;

        return `No período analisado foram realizados ${csCount} atendimentos de Customer Success (${callsCount} ligações e ${meetingsCount} reuniões), dos quais ${supportCount} evoluíram para chamados técnicos. Atualmente existem ${openCount} chamados em aberto e ${closedCount} chamados já resolvidos, totalizando ${totalTickets} registros. O estado com maior volume de atendimentos foi ${topState} e a empresa mais atendida foi ${topCompany}.`;
    }

    getTopState() {
        const states = this.getTicketsByState();
        if (Object.keys(states).length === 0) return 'N/A';
        return Object.entries(states)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    getTopCompany() {
        const companies = this.getTicketsByCompany();
        if (Object.keys(companies).length === 0) return 'N/A';
        return Object.entries(companies)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    getStrategicIndicators() {
        const csToTicketRatio = this.getConversionRate();
        const firstInteractionResolution = this.calculateFirstInteractionResolution();
        const avgResolutionTime = this.getAverageDaysToResolve();
        const recurringClients = this.getRecurringClientsPercentage();
        const nextWeekForecast = this.forecastNextWeekLoad();

        return {
            csToTicketRatio,
            firstInteractionResolution,
            avgResolutionTime,
            recurringClients,
            nextWeekForecast
        };
    }

    calculateFirstInteractionResolution() {
        const closedTickets = this.getClosedTickets();
        if (closedTickets.length === 0) return 0;
        
        const firstInteractionResolved = closedTickets.filter(ticket => {
            const start = ticket['Data de abertura'];
            const end = ticket['Data de fechamento'];
            if (start && end) {
                const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                return days <= 1;
            }
            return false;
        }).length;

        return ((firstInteractionResolved / closedTickets.length) * 100).toFixed(2);
    }

    getRecurringClientsPercentage() {
        const clientCounts = {};
        this.filteredData.forEach(row => {
            const client = row['Cliente'];
            if (client) {
                clientCounts[client] = (clientCounts[client] || 0) + 1;
            }
        });

        const recurringClients = Object.values(clientCounts).filter(count => count > 1).length;
        const totalClients = Object.keys(clientCounts).length;

        if (totalClients === 0) return 0;
        return ((recurringClients / totalClients) * 100).toFixed(2);
    }

    forecastNextWeekLoad() {
        const avgPerDay = this.getAverageAttendancesPerDay();
        return Math.ceil(avgPerDay * 5);
    }
}

const dataProcessor = new DataProcessor();
