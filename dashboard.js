class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Tentar carregar arquivo automático, se falhar, carregar dados de exemplo
        this.loadDataFromFile().catch(() => {
            console.log('Arquivo não encontrado, carregando dados de exemplo...');
            this.loadSampleData();
        });
        this.updateLastModified();
    }

    setupEventListeners() {
        document.getElementById('btnUploadFile').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        document.getElementById('btnApplyFilters').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('btnResetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        document.getElementById('btnExportPDF').addEventListener('click', () => {
            this.exportPDF();
        });

        document.getElementById('btnExportExcel').addEventListener('click', () => {
            this.exportExcel();
        });

        document.getElementById('btnFullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('btnTheme').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        document.getElementById('quickSearch').addEventListener('input', () => {
            this.applyFilters();
        });

        setInterval(() => {
            this.updateLastModified();
        }, 60000);
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                let jsonData = [];

                if (file.name.endsWith('.csv')) {
                    jsonData = this.parseCSV(data);
                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    jsonData = XLSX.utils.sheet_to_json(worksheet);
                }

                if (jsonData.length > 0) {
                    dataProcessor.loadData(jsonData);
                    this.populateFilters();
                    this.render();
                    this.showNotification('Arquivo carregado com sucesso!', 'success');
                } else {
                    this.showNotification('Nenhum dado encontrado no arquivo', 'error');
                }
            } catch (error) {
                console.error('Erro ao processar arquivo:', error);
                this.showNotification('Erro ao processar arquivo: ' + error.message, 'error');
            }
        };

        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    }

    parseCSV(data) {
        const delimiter = data.includes(';') ? ';' : ',';
        const lines = data.split('\n');
        
        if (lines.length === 0) return [];
        
        const headers = this.parseCSVLine(lines[0], delimiter);
        const result = [];
        let i = 1;

        while (i < lines.length) {
            let line = lines[i].trim();
            
            // Pular linhas vazias
            if (!line) {
                i++;
                continue;
            }

            // Contar aspas para detectar campos multiline
            let quoteCount = (line.match(/"/g) || []).length;
            
            // Se houver número ímpar de aspas, é um campo multiline
            while (quoteCount % 2 !== 0 && i + 1 < lines.length) {
                i++;
                line += '\n' + lines[i];
                quoteCount = (line.match(/"/g) || []).length;
            }

            const values = this.parseCSVLine(line, delimiter);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            result.push(obj);
            i++;
        }

        return result;
    }

    parseCSVLine(line, delimiter) {
        const result = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (insideQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === delimiter && !insideQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    loadDataFromFile() {
        return new Promise((resolve, reject) => {
            const csvDataFromStorage = localStorage.getItem('csvData');
            
            if (csvDataFromStorage) {
                const fileName = localStorage.getItem('csvFileName') || 'arquivo carregado';
                const jsonData = this.parseCSV(csvDataFromStorage);
                if (jsonData.length > 0) {
                    dataProcessor.loadData(jsonData);
                    this.populateFilters();
                    this.render();
                    this.showNotification('Dados de ' + fileName + ' carregados com sucesso!', 'success');
                    localStorage.removeItem('csvData');
                    localStorage.removeItem('csvFileName');
                    resolve();
                    return;
                }
            }

            const fileName = 'chamados_todos_inicio_a_2026-07-02.csv';
            
            fetch(fileName)
                .then(response => {
                    if (!response.ok) throw new Error('Arquivo não encontrado');
                    return response.text();
                })
                .then(data => {
                    const jsonData = this.parseCSV(data);
                    if (jsonData.length > 0) {
                        dataProcessor.loadData(jsonData);
                        this.populateFilters();
                        this.render();
                        this.showNotification('Dados carregados com sucesso!', 'success');
                        resolve();
                    } else {
                        throw new Error('Nenhum dado encontrado');
                    }
                })
                .catch(error => {
                    console.warn('Não foi possível carregar arquivo automático:', error.message);
                    reject(error);
                });
        });
    }

    populateFilters() {
        const weeks = dataProcessor.getWeeks();
        const months = dataProcessor.getMonths();
        const states = dataProcessor.getUniqueValues('Estado');
        const companies = dataProcessor.getUniqueValues('Empresa do cliente');
        const systems = dataProcessor.getUniqueValues('Sistema(s)');
        const teamColumn = dataProcessor.teamColumn || 'Equpe';
        const teams = dataProcessor.getUniqueValues(teamColumn);
        const statuses = dataProcessor.getUniqueValues('Status');
        const types = dataProcessor.getUniqueValues('Tipo');

        this.populateSelect('filterWeek', weeks);
        this.populateSelect('filterMonth', months);
        this.populateSelect('filterState', states);
        this.populateSelect('filterCompany', companies);
        this.populateSelect('filterSystem', systems);
        this.populateSelect('filterTeam', teams);
        this.populateSelect('filterStatus', statuses);
        this.populateSelect('filterType', types);
    }

    populateSelect(elementId, options) {
        const select = document.getElementById(elementId);
        const currentValue = select.value;
        
        while (select.options.length > 1) {
            select.remove(1);
        }

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });

        select.value = currentValue;
    }

    applyFilters() {
        const filters = {
            week: document.getElementById('filterWeek').value,
            month: document.getElementById('filterMonth').value,
            state: document.getElementById('filterState').value,
            company: document.getElementById('filterCompany').value,
            system: document.getElementById('filterSystem').value,
            team: document.getElementById('filterTeam').value,
            status: document.getElementById('filterStatus').value,
            type: document.getElementById('filterType').value,
            search: document.getElementById('quickSearch').value
        };

        dataProcessor.applyFilters(filters);
        this.render();
    }

    resetFilters() {
        document.getElementById('filterWeek').value = '';
        document.getElementById('filterMonth').value = '';
        document.getElementById('filterState').value = '';
        document.getElementById('filterCompany').value = '';
        document.getElementById('filterSystem').value = '';
        document.getElementById('filterTeam').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterType').value = '';
        document.getElementById('quickSearch').value = '';

        dataProcessor.applyFilters({
            week: '', month: '', state: '', company: '', system: '', 
            team: '', status: '', type: '', search: ''
        });
        this.render();
    }

    render() {
        this.renderKPIs();
        this.renderCharts();
        this.renderTables();
        this.renderAlerts();
        this.renderPlanning();
        this.renderTimeline();
        this.renderStrategicIndicators();
        this.renderExecutiveSummary();
        this.updateLastModified();
    }

    renderKPIs() {
        const container = document.getElementById('kpisContainer');
        container.innerHTML = '';

        const csCount = dataProcessor.getCSAttendances().length;
        const supportCount = dataProcessor.getSupportTickets().length;
        const callsCount = dataProcessor.getCallsCount();
        const meetingsCount = dataProcessor.getMeetingsCount();
        const openCount = dataProcessor.getOpenTickets().length;
        const closedCount = dataProcessor.getClosedTickets().length;
        const conversionRate = dataProcessor.getConversionRate();
        const uniqueClients = dataProcessor.getUniqueClients();
        const uniqueStates = dataProcessor.getUniqueStates();
        const uniqueCompanies = dataProcessor.getUniqueCompanies();
        const uniqueTechnicians = dataProcessor.getUniqueTechnicians();
        const mostUsedSystem = dataProcessor.getMostUsedSystem();

        const kpis = [
            { icon: 'fa-phone', label: 'Total de Atendimentos CS', value: csCount, change: '' },
            { icon: 'fa-headset', label: 'Total de Ligações', value: callsCount, change: '' },
            { icon: 'fa-users', label: 'Total de Reuniões', value: meetingsCount, change: '' },
            { icon: 'fa-ticket-alt', label: 'Total de Chamados Técnicos', value: supportCount, change: '' },
            { icon: 'fa-clock', label: 'Chamados Abertos', value: openCount, change: '' },
            { icon: 'fa-check-circle', label: 'Chamados Resolvidos', value: closedCount, change: '' },
            { icon: 'fa-percentage', label: 'Taxa de Conversão', value: conversionRate + '%', change: '' },
            { icon: 'fa-user-tie', label: 'Clientes Atendidos', value: uniqueClients, change: '' },
            { icon: 'fa-map-marker-alt', label: 'Estados Atendidos', value: uniqueStates, change: '' },
            { icon: 'fa-building', label: 'Empresas Atendidas', value: uniqueCompanies, change: '' },
            { icon: 'fa-tools', label: 'Técnicos Envolvidos', value: uniqueTechnicians, change: '' },
            { icon: 'fa-cogs', label: 'Sistema Mais Utilizado', value: mostUsedSystem, change: '' }
        ];

        kpis.forEach(kpi => {
            const col = document.createElement('div');
            col.className = 'col-lg-2 col-md-3 col-sm-6 mb-3';
            col.innerHTML = `
                <div class="kpi-card">
                    <div class="kpi-icon">
                        <i class="fas ${kpi.icon}"></i>
                    </div>
                    <div class="kpi-label">${kpi.label}</div>
                    <div class="kpi-value">${kpi.value}</div>
                    ${kpi.change ? `<div class="kpi-change ${kpi.change.startsWith('+') ? 'positive' : 'negative'}">
                        <i class="fas ${kpi.change.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        ${kpi.change}
                    </div>` : ''}
                </div>
            `;
            container.appendChild(col);
        });
    }

    renderCharts() {
        const ticketsByDay = dataProcessor.getTicketsByDay();
        const ticketsByType = dataProcessor.getTicketsByType();
        const ticketsByCompany = dataProcessor.getTicketsByCompany();
        const ticketsByState = dataProcessor.getTicketsByState();
        const ticketsByTechnician = dataProcessor.getTicketsByTechnician();
        const csCount = dataProcessor.getCSAttendances().length;
        const supportCount = dataProcessor.getSupportTickets().length;

        chartsManager.createAttendanceByDayChart(ticketsByDay);
        chartsManager.createWeeklyEvolutionChart(ticketsByDay);
        chartsManager.createAttendanceTypesChart(ticketsByType);
        chartsManager.createCSVsSupportChart(csCount, supportCount);
        chartsManager.createCompanyRankingChart(ticketsByCompany);
        chartsManager.createStateRankingChart(ticketsByState);
        chartsManager.createTechnicianTicketsChart(ticketsByTechnician);

        this.renderHeatmap();
        this.renderSystemsList();
    }

    renderHeatmap() {
        const heatmapData = dataProcessor.getHeatmapData();
        const container = document.getElementById('heatmapContainer');
        container.innerHTML = '';

        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const maxValue = Math.max(...Object.values(heatmapData), 1);

        dayNames.forEach(day => {
            const count = heatmapData[day] || 0;
            const level = Math.min(4, Math.floor((count / maxValue) * 4));
            const cell = document.createElement('div');
            cell.className = `heatmap-cell level-${level}`;
            cell.innerHTML = `<div>${day}<br><small>${count}</small></div>`;
            cell.title = `${day}: ${count} atendimentos`;
            container.appendChild(cell);
        });
    }

    renderSystemsList() {
        const systems = dataProcessor.getSystemsUsage();
        const container = document.getElementById('systemsList');
        container.innerHTML = '';

        const sorted = Object.entries(systems)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        sorted.forEach(([system, count]) => {
            const item = document.createElement('div');
            item.className = 'system-item';
            item.innerHTML = `
                <span class="system-item-name">${system}</span>
                <span class="system-item-count">${count}</span>
            `;
            container.appendChild(item);
        });

        if (sorted.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum sistema registrado</p>';
        }
    }

    renderTables() {
        this.renderOpenTicketsTable();
        this.renderClosedTicketsTable();
        this.renderMostServedClientsTable();
        this.renderTopTechniciansTable();
    }

    renderOpenTicketsTable() {
        const openTickets = dataProcessor.getOpenTickets().slice(0, 10);
        const tbody = document.querySelector('#tableOpenTickets tbody');
        tbody.innerHTML = '';

        const now = new Date();
        openTickets.forEach(ticket => {
            const daysOpen = Math.floor((now - ticket['Data de abertura']) / (1000 * 60 * 60 * 24));
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${ticket['Protocolo'] || 'N/A'}</strong></td>
                <td>${ticket['Cliente'] || 'N/A'}</td>
                <td>${ticket['Empresa do cliente'] || 'N/A'}</td>
                <td><span class="badge bg-warning">${daysOpen} dias</span></td>
            `;
            tbody.appendChild(row);
        });

        if (openTickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum chamado aberto</td></tr>';
        }
    }

    renderClosedTicketsTable() {
        const closedTickets = dataProcessor.getClosedTickets().slice(0, 10);
        const tbody = document.querySelector('#tableClosedTickets tbody');
        tbody.innerHTML = '';

        closedTickets.forEach(ticket => {
            const daysToResolve = Math.floor((ticket['Data de fechamento'] - ticket['Data de abertura']) / (1000 * 60 * 60 * 24));
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${ticket['Protocolo'] || 'N/A'}</strong></td>
                <td>${ticket['Cliente'] || 'N/A'}</td>
                <td>${ticket['Empresa do cliente'] || 'N/A'}</td>
                <td><span class="badge bg-success">${daysToResolve} dias</span></td>
            `;
            tbody.appendChild(row);
        });

        if (closedTickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum chamado encerrado</td></tr>';
        }
    }

    renderMostServedClientsTable() {
        const clients = dataProcessor.getClientsWithMostTickets();
        const tbody = document.querySelector('#tableMostServedClients tbody');
        tbody.innerHTML = '';

        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${client.name}</strong></td>
                <td>${client.company}</td>
                <td><span class="badge bg-cyan text-dark">${client.count}</span></td>
            `;
            tbody.appendChild(row);
        });

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Nenhum cliente registrado</td></tr>';
        }
    }

    renderTopTechniciansTable() {
        const technicians = dataProcessor.getTicketsByTechnician();
        const sorted = Object.entries(technicians)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10);

        const tbody = document.querySelector('#tableTopTechnicians tbody');
        tbody.innerHTML = '';

        sorted.forEach(([tech, data]) => {
            const rate = data.total > 0 ? ((data.resolved / data.total) * 100).toFixed(0) : 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${tech}</strong></td>
                <td>${data.total}</td>
                <td>${data.resolved}</td>
                <td><span class="badge bg-success">${rate}%</span></td>
            `;
            tbody.appendChild(row);
        });

        if (sorted.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum técnico registrado</td></tr>';
        }
    }

    renderAlerts() {
        const container = document.getElementById('alertsContainer');
        container.innerHTML = '';

        const alerts = [];

        const ticketsOver7Days = dataProcessor.getTicketsOverSevenDays();
        if (ticketsOver7Days.length > 0) {
            alerts.push({
                type: 'error',
                icon: 'fa-exclamation-circle',
                title: `${ticketsOver7Days.length} Chamados em aberto há mais de 7 dias`,
                description: 'Ação imediata necessária'
            });
        }

        const ticketsWithoutTech = dataProcessor.getTicketsWithoutTechnician();
        if (ticketsWithoutTech.length > 0) {
            alerts.push({
                type: 'warning',
                icon: 'fa-user-slash',
                title: `${ticketsWithoutTech.length} Chamados sem técnico atribuído`,
                description: 'Necessário atribuir responsável'
            });
        }

        const ticketsWithoutCity = dataProcessor.getTicketsWithoutCity();
        if (ticketsWithoutCity.length > 0) {
            alerts.push({
                type: 'warning',
                icon: 'fa-map-marker-alt',
                title: `${ticketsWithoutCity.length} Chamados sem cidade registrada`,
                description: 'Informação incompleta'
            });
        }

        const clientsWithMostTickets = dataProcessor.getClientsWithMostTickets();
        if (clientsWithMostTickets.length > 0 && clientsWithMostTickets[0].count > 5) {
            alerts.push({
                type: 'info',
                icon: 'fa-info-circle',
                title: `Cliente ${clientsWithMostTickets[0].name} com ${clientsWithMostTickets[0].count} chamados`,
                description: 'Considere contato proativo'
            });
        }

        if (alerts.length === 0) {
            container.innerHTML = '<p class="text-muted"><i class="fas fa-check-circle text-success"></i> Nenhum alerta no momento</p>';
            return;
        }

        alerts.forEach(alert => {
            const alertEl = document.createElement('div');
            alertEl.className = `alert-item ${alert.type}`;
            alertEl.innerHTML = `
                <div class="alert-icon">
                    <i class="fas ${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <strong>${alert.title}</strong>
                    <small>${alert.description}</small>
                </div>
            `;
            container.appendChild(alertEl);
        });
    }

    renderPlanning() {
        const openTickets = dataProcessor.getOpenTickets().length;
        const uniqueClients = dataProcessor.getUniqueClients();
        const ticketsOver7Days = dataProcessor.getTicketsOverSevenDays().length;
        const forecast = dataProcessor.forecastNextWeekLoad();

        document.getElementById('planOpenTickets').textContent = openTickets;
        document.getElementById('planPendingClients').textContent = uniqueClients;
        document.getElementById('planMainRisks').textContent = ticketsOver7Days;
        document.getElementById('planForecastAttendance').textContent = forecast;

        const pendenciesContainer = document.getElementById('planPendencies');
        pendenciesContainer.innerHTML = '';

        const pendencies = [];

        if (ticketsOver7Days > 0) {
            pendencies.push({
                icon: 'fa-exclamation-triangle',
                text: `${ticketsOver7Days} chamados em aberto há mais de 7 dias`
            });
        }

        const ticketsWithoutTech = dataProcessor.getTicketsWithoutTechnician();
        if (ticketsWithoutTech.length > 0) {
            pendencies.push({
                icon: 'fa-user-slash',
                text: `${ticketsWithoutTech.length} chamados sem técnico atribuído`
            });
        }

        if (pendencies.length === 0) {
            pendencies.push({
                icon: 'fa-check-circle',
                text: 'Nenhuma pendência identificada'
            });
        }

        pendencies.forEach(pendency => {
            const item = document.createElement('div');
            item.className = 'pendency-item';
            item.innerHTML = `
                <i class="fas ${pendency.icon}"></i>
                <small>${pendency.text}</small>
            `;
            pendenciesContainer.appendChild(item);
        });
    }

    renderTimeline() {
        const timelineData = dataProcessor.getTimelineData();
        const container = document.getElementById('timelineContainer');
        container.innerHTML = '';

        if (timelineData.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum chamado registrado</p>';
            return;
        }

        timelineData.forEach((ticket, index) => {
            const dateStr = ticket['Data de abertura'].toLocaleDateString('pt-BR');
            const status = ticket['Data de fechamento'] ? 'Resolvido' : 'Aberto';
            const statusClass = ticket['Data de fechamento'] ? 'success' : 'warning';

            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-dot">${index + 1}</div>
                <div class="timeline-content">
                    <div class="timeline-date">${dateStr}</div>
                    <div class="timeline-title">${ticket['Protocolo']} - ${ticket['Cliente']}</div>
                    <div class="timeline-description">
                        <strong>${ticket['Empresa do cliente']}</strong> | 
                        <span class="badge bg-${statusClass}">${status}</span>
                        ${ticket['Técnico responsável'] ? ` | Técnico: ${ticket['Técnico responsável']}` : ''}
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    renderStrategicIndicators() {
        const indicators = dataProcessor.getStrategicIndicators();
        const container = document.getElementById('strategicIndicatorsContainer');
        container.innerHTML = '';

        const strategicData = [
            {
                label: 'CS → Chamados Técnicos',
                value: indicators.csToTicketRatio + '%',
                detail: 'Taxa de conversão'
            },
            {
                label: 'Resolução 1ª Interação',
                value: indicators.firstInteractionResolution + '%',
                detail: 'Eficiência de resolução'
            },
            {
                label: 'Tempo Médio Resolução',
                value: indicators.avgResolutionTime + ' dias',
                detail: 'Dias para resolver'
            },
            {
                label: 'Clientes Recorrentes',
                value: indicators.recurringClients + '%',
                detail: 'Taxa de retenção'
            },
            {
                label: 'Previsão Próx. Semana',
                value: indicators.nextWeekForecast,
                detail: 'Atendimentos esperados'
            }
        ];

        strategicData.forEach(indicator => {
            const col = document.createElement('div');
            col.className = 'col-lg-2 col-md-4 col-sm-6 mb-3';
            col.innerHTML = `
                <div class="strategic-indicator">
                    <div class="strategic-indicator-label">${indicator.label}</div>
                    <div class="strategic-indicator-value">${indicator.value}</div>
                    <div class="strategic-indicator-detail">${indicator.detail}</div>
                </div>
            `;
            container.appendChild(col);
        });
    }

    renderExecutiveSummary() {
        const summary = dataProcessor.generateExecutiveSummary();
        document.getElementById('executiveSummary').textContent = summary;
    }

    loadSampleData() {
        const sampleData = [
            {
                'Protocolo': 'INFANT-001',
                'Status': 'Aberto',
                'Tipo': 'Suporte',
                'Cliente': 'João Silva',
                'Empresa do cliente': 'Politec',
                'Resumo': 'Problema de conexão',
                'Descrição': 'Cliente relata problema de conexão intermitente',
                'Técnico responsável': 'Carlos Santos',
                'Equipamento': 'Router',
                'Sistema(s)': 'Windows Server',
                'Número de Série': 'SN123456',
                'Cidade': 'São Paulo',
                'Estado': 'SP',
                'Data de abertura': '2024-01-15',
                'Data de fechamento': '',
                'Equpe': 'suporte'
            },
            {
                'Protocolo': 'INFANT-002',
                'Status': 'Fechado',
                'Tipo': 'Atendimento',
                'Cliente': 'Maria Santos',
                'Empresa do cliente': 'TechCorp',
                'Resumo': 'Reunião de alinhamento',
                'Descrição': 'Reunião com cliente para alinhamento de demandas',
                'Técnico responsável': 'Ana Costa',
                'Equipamento': 'N/A',
                'Sistema(s)': 'N/A',
                'Número de Série': 'N/A',
                'Cidade': 'Rio de Janeiro',
                'Estado': 'RJ',
                'Data de abertura': '2024-01-10',
                'Data de fechamento': '2024-01-10',
                'Equpe': 'CS'
            }
        ];

        dataProcessor.loadData(sampleData);
        this.populateFilters();
        this.render();
    }

    exportPDF() {
        const element = document.querySelector('.container-fluid');
        const opt = {
            margin: 10,
            filename: 'dashboard-executivo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
        };
        html2pdf().set(opt).from(element).save();
    }

    exportExcel() {
        const ws = XLSX.utils.json_to_sheet(dataProcessor.filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
        XLSX.writeFile(wb, 'dashboard-executivo.xlsx');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Erro ao ativar fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    }

    updateLastModified() {
        const lastUpdate = dataProcessor.getLastModified();
        document.getElementById('lastUpdate').textContent = lastUpdate;
    }

    showNotification(message, type = 'info') {
        const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-info';
        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" role="alert" style="top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', alertHTML);

        setTimeout(() => {
            const alert = document.querySelector('.position-fixed.alert');
            if (alert) alert.remove();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
    new Dashboard();
});
