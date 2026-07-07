# 🚀 Guia Rápido - Dashboard Executivo INFANT.ID

## Como Usar

### Opção 1: Abrir o Dashboard com Dados Reais (Recomendado)

1. **Abra o arquivo `test.html` no navegador**
   - Clique com botão direito em `test.html`
   - Selecione "Abrir com" → seu navegador preferido

2. **Carregue o arquivo CSV**
   - Clique em "📁 Carregar Arquivo CSV"
   - Selecione `chamados_todos_inicio_a_2026-07-02.csv`
   - O dashboard será aberto automaticamente com os dados

### Opção 2: Abrir Diretamente (Sem Dados)

1. **Abra `index.html` no navegador**
2. **Clique em "Carregar"** na barra superior
3. **Selecione um arquivo CSV ou Excel** com seus dados

### Opção 3: Usar Servidor Local (Melhor Experiência)

Se você tiver Python instalado:

```bash
cd "d:\Documentos\Apresentação"
python -m http.server 8000
```

Depois acesse: `http://localhost:8000`

---

## 📊 Estrutura de Dados Esperada

O arquivo CSV/Excel deve ter as seguintes colunas:

| Coluna | Exemplo | Notas |
|--------|---------|-------|
| Protocolo | CH-2026-7586 | Identificador único |
| Status | Em Atendimento, Resolvido | Status do chamado |
| Tipo | Equipamento, Sistema, ligação | Tipo de atendimento |
| Cliente | SERGIO SOARES | Nome do cliente |
| Empresa do cliente | ganha tempo | Empresa/Organização |
| Técnico responsável | Lucas de Azevedo | Responsável |
| Sistema(s) | OPENBIO LEGADO | Sistema envolvido |
| Cidade | Cuiabá | Cidade |
| Estado | MT | Estado (UF) |
| Data de abertura | 01/07/2026, 16:30:56 | Formato: DD/MM/YYYY |
| Data de fechamento | (vazio para abertos) | Deixe em branco se aberto |
| Equpe ou Equipe | suporte, CS | Equipe responsável |

---

## 🎯 Principais Funcionalidades

### KPIs Automáticos
- Total de Atendimentos CS
- Total de Chamados Técnicos
- Chamados Abertos/Resolvidos
- Taxa de Conversão
- Clientes Atendidos
- Estados Atendidos
- E muito mais...

### Gráficos
- Atendimentos por dia
- Evolução semanal
- Tipos de atendimento
- CS vs Suporte
- Ranking de empresas
- Ranking de estados
- Chamados por técnico
- Heatmap de volume

### Filtros
- Semana
- Mês
- Estado
- Empresa
- Sistema
- Equipe
- Status
- Tipo
- Pesquisa rápida

### Tabelas
- Chamados abertos
- Chamados encerrados
- Clientes mais atendidos
- Técnicos com maior volume

### Alertas Automáticos
- Chamados em aberto há mais de 7 dias
- Chamados sem técnico
- Chamados sem cidade
- Clientes com muitos chamados

### Exportação
- **PDF**: Clique no ícone de PDF
- **Excel**: Clique no ícone de Excel

### Outros
- **Tela Cheia**: Clique no ícone de expansão
- **Tema**: Clique no ícone de lua para alternar tema

---

## 🔧 Troubleshooting

### "Arquivo não carregado"
- Verifique se o arquivo está no mesmo diretório
- Certifique-se de que o delimitador é `;` (ponto e vírgula)
- Verifique os nomes das colunas

### "Nenhum dado aparece"
- Atualize a página (F5)
- Verifique se o arquivo tem dados
- Abra o console (F12) para ver mensagens de erro

### "Os gráficos não aparecem"
- Certifique-se de que há dados carregados
- Tente limpar os filtros
- Atualize a página

---

## 📝 Atualizar Dados

1. **Substitua o arquivo CSV** com dados mais recentes
2. **Abra o `test.html`** novamente
3. **Carregue o novo arquivo**
4. O dashboard será atualizado automaticamente

---

## 🎨 Customização

### Cores
Edite o arquivo `styles.css` e procure por `:root`:

```css
:root {
    --dark-navy: #0a1628;      /* Fundo principal */
    --petrol-blue: #1a3a52;    /* Cards */
    --cyan: #00d4ff;           /* Destaques */
    --green: #10b981;          /* Positivo */
    --red: #ef4444;            /* Negativo */
}
```

### Fontes
Edite o arquivo `index.html` e procure por `Google Fonts`.

---

## 📞 Suporte

Se encontrar problemas:

1. Abra o **Console do Navegador** (F12)
2. Procure por mensagens de erro
3. Verifique se o arquivo está no formato correto
4. Tente com o arquivo de exemplo: `dados-exemplo.csv`

---

## ✅ Checklist de Uso

- [ ] Arquivo CSV/Excel preparado
- [ ] Colunas com nomes corretos
- [ ] Datas no formato DD/MM/YYYY
- [ ] Equipe como "CS" ou "suporte"
- [ ] Arquivo de fechamento vazio para chamados abertos
- [ ] Abrir `test.html` no navegador
- [ ] Carregar arquivo
- [ ] Dashboard exibindo dados
- [ ] Filtros funcionando
- [ ] Gráficos visíveis

---

**Versão**: 1.0.0  
**Última Atualização**: Julho 2026  
**Desenvolvido para**: INFANT.ID
