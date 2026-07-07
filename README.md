# Dashboard Executivo - INFANT.ID

Um dashboard executivo moderno e responsivo para apresentações semanais, desenvolvido com HTML5, CSS3, JavaScript, Bootstrap 5 e Chart.js.

## 🎯 Características Principais

### Identidade Visual
- **Fundo**: Azul Marinho Escuro (#0a1628)
- **Cards**: Azul Petróleo (#1a3a52)
- **Destaques**: Azul Ciano (#00d4ff)
- **Indicadores**: Verde para positivo, Vermelho para negativo
- **Animações**: Suaves e elegantes
- **Design**: Premium com sombras e bordas arredondadas

### Funcionalidades

#### 📊 KPIs e Métricas
- Total de Atendimentos CS
- Total de Ligações
- Total de Reuniões
- Total de Chamados Técnicos
- Chamados Abertos
- Chamados Resolvidos
- Taxa de Conversão
- Clientes Atendidos
- Estados Atendidos
- Empresas Atendidas
- Técnicos Envolvidos
- Sistema Mais Utilizado

#### 📈 Gráficos
- **Barras**: Atendimentos por dia
- **Linhas**: Evolução semanal
- **Pizza**: Tipos de atendimento
- **Rosca**: Distribuição CS vs Suporte
- **Horizontal**: Ranking de empresas e estados
- **Barras**: Chamados por técnico
- **Heatmap**: Dias com maior volume

#### 📋 Tabelas
- Chamados abertos
- Chamados encerrados
- Clientes mais atendidos
- Técnicos com maior volume

#### ⚠️ Alertas Automáticos
- Chamados em aberto há mais de 7 dias
- Chamados sem técnico atribuído
- Chamados sem cidade registrada
- Clientes com maior número de chamados

#### 📅 Planejamento
- Chamados em aberto
- Clientes pendentes
- Principais riscos
- Previsão de atendimentos
- Principais pendências

#### ⭐ Indicadores Estratégicos
- CS → Chamados Técnicos (Taxa de conversão)
- Resolução na 1ª Interação
- Tempo Médio de Resolução
- Clientes Recorrentes
- Previsão de Carga Próxima Semana

#### 🔍 Filtros
- Semana
- Mês
- Estado
- Empresa
- Cliente
- Sistema
- Tipo
- Status
- Equipe
- Pesquisa Rápida

#### 💾 Funcionalidades Adicionais
- Carregamento automático de Excel/CSV
- Exportar PDF
- Exportar Excel
- Modo Tela Cheia
- Tema Escuro/Claro
- Última atualização
- Indicador de sincronização
- Resumo Executivo Automático
- Timeline dos Chamados

## 📁 Estrutura de Arquivos

```
/
├── index.html           # Arquivo HTML principal
├── styles.css           # Estilos CSS
├── data-processor.js    # Processamento de dados
├── charts.js            # Gerenciamento de gráficos
├── dashboard.js         # Lógica principal do dashboard
├── dados-exemplo.csv    # Arquivo de exemplo
└── README.md            # Este arquivo
```

## 🚀 Como Usar

### 1. Abrir o Dashboard
Simplesmente abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, Safari).

### 2. Carregar Dados
Clique no botão **"Carregar"** na barra superior e selecione um arquivo Excel (.xlsx, .xls) ou CSV.

**Formato esperado das colunas:**
- Protocolo
- Status
- Tipo
- Cliente
- Empresa do cliente
- Resumo
- Descrição
- Técnico responsável
- Equipamento
- Sistema(s)
- Número de Série
- Cidade
- Estado
- Data de abertura (formato: DD/MM/YYYY ou YYYY-MM-DD)
- Data de fechamento (pode estar vazia para chamados abertos)
- Equpe (CS ou suporte)

### 3. Usar Filtros
Os filtros são preenchidos automaticamente com base nos dados carregados. Selecione os valores desejados e clique em "Aplicar" ou use a pesquisa rápida.

### 4. Exportar Dados
- **PDF**: Clique no ícone de PDF para exportar o dashboard
- **Excel**: Clique no ícone de Excel para exportar os dados filtrados

### 5. Alternar Tema
Clique no ícone de lua para alternar entre tema escuro e claro.

### 6. Tela Cheia
Clique no ícone de expansão para ativar o modo tela cheia.

## 📊 Estrutura de Dados Esperada

### Arquivo CSV/Excel
O arquivo deve conter as seguintes colunas:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| Protocolo | Texto | Identificador único do chamado |
| Status | Texto | Status do chamado (Aberto, Fechado, etc) |
| Tipo | Texto | Tipo de atendimento |
| Cliente | Texto | Nome do cliente |
| Empresa do cliente | Texto | Empresa do cliente |
| Resumo | Texto | Resumo do chamado |
| Descrição | Texto | Descrição detalhada |
| Técnico responsável | Texto | Nome do técnico |
| Equipamento | Texto | Equipamento envolvido |
| Sistema(s) | Texto | Sistema(s) envolvido(s) |
| Número de Série | Texto | Número de série do equipamento |
| Cidade | Texto | Cidade do cliente |
| Estado | Texto | Estado (UF) do cliente |
| Data de abertura | Data | Data de abertura (DD/MM/YYYY) |
| Data de fechamento | Data | Data de fechamento (vazia se aberto) |
| Equpe | Texto | Equipe (CS ou suporte) |

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos avançados com gradientes e animações
- **JavaScript**: Lógica e interatividade
- **Bootstrap 5**: Framework responsivo
- **Chart.js**: Gráficos interativos
- **SheetJS**: Leitura de Excel/CSV
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Poppins)
- **html2pdf**: Exportação para PDF

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- 📱 Smartphones
- 💻 Tablets
- 🖥️ Notebooks
- 🖨️ Monitores
- 📺 TVs
- 🎬 Projetores

## 🎨 Customização

### Cores
As cores principais estão definidas em `:root` no arquivo `styles.css`:

```css
:root {
    --dark-navy: #0a1628;
    --petrol-blue: #1a3a52;
    --cyan: #00d4ff;
    --light-gray: #b0b8c1;
    --white: #ffffff;
    --green: #10b981;
    --red: #ef4444;
    --orange: #f97316;
}
```

### Fontes
A fonte padrão é "Poppins" do Google Fonts. Para alterar, modifique a importação em `index.html`.

## 📈 Cálculos Automáticos

O dashboard calcula automaticamente:

- **Taxa de Conversão**: Atendimentos CS ÷ Chamados Técnicos
- **Quantidade média de atendimentos por dia**: Total de atendimentos ÷ Dias
- **Quantidade média de chamados por dia**: Total de chamados ÷ Dias
- **Crescimento semanal**: Comparativo com semana anterior
- **Dias para resolver**: Data de fechamento - Data de abertura
- **Taxa de resolução por técnico**: Chamados resolvidos ÷ Total de chamados

## 🔐 Segurança

- Os dados são processados localmente no navegador
- Nenhum dado é enviado para servidores externos
- O arquivo é carregado apenas quando o usuário escolhe

## 🐛 Troubleshooting

### O arquivo não carrega
- Verifique se o formato está correto (Excel ou CSV)
- Certifique-se de que as colunas têm os nomes exatos
- Verifique o formato das datas (DD/MM/YYYY ou YYYY-MM-DD)

### Os gráficos não aparecem
- Verifique se há dados carregados
- Tente atualizar a página (F5)
- Verifique o console do navegador para erros

### Filtros não funcionam
- Certifique-se de que os dados foram carregados
- Tente limpar os filtros e aplicar novamente

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. O console do navegador (F12) para mensagens de erro
2. O arquivo de exemplo (dados-exemplo.csv)
3. A estrutura esperada de dados acima

## 📝 Notas Importantes

- **Data de Fechamento Vazia**: Indica que o chamado ainda está aberto
- **Equpe**: Deve ser exatamente "CS" ou "suporte" (case-sensitive)
- **Atualização**: Sempre que o arquivo for atualizado, atualize a página do navegador

## 🎯 Resumo Executivo

O dashboard gera automaticamente um resumo executivo como:

> "Na última semana foram realizados 86 atendimentos de Customer Success, dos quais 14 evoluíram para chamados técnicos. Atualmente existem 9 chamados em aberto e 58 chamados já resolvidos. Houve crescimento de 18% em relação à semana anterior. O estado com maior volume de atendimentos foi Mato Grosso e a empresa mais atendida foi Politec."

Este texto é gerado dinamicamente com base nos dados carregados.

## 🚀 Melhorias Futuras

- Integração com banco de dados
- Sincronização em tempo real
- Notificações push
- Relatórios agendados
- Análise preditiva
- Integração com CRM

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2024  
**Desenvolvido para**: INFANT.ID
