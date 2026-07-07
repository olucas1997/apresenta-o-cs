# 📊 Dashboard de Chamados - Versão Diretor

## ✨ Novo Layout Criado

Criei um novo dashboard especificamente para visualização de **semana anterior vs semana atual**, ideal para apresentações ao diretor.

## 🎯 Características

### Layout Principal
- **Duas Colunas**: Semana Anterior | Semana Atual
- **Calendários Visuais**: Mostra os dias da semana com destaque para hoje
- **KPIs Lado a Lado**: Comparação direta entre semanas

### Métricas por Semana
- 📞 **Chamados CS**: Total de atendimentos de Customer Success
- 🔧 **Chamados Suporte**: Total de chamados técnicos
- ✅ **Resolvidos**: Chamados finalizados
- ⏳ **Em Atendimento**: Chamados abertos

### Gráficos
- **Problemas Mais Comuns**: Top 5 tipos de chamados por semana
- Comparação visual entre semanas

### Tabela
- **Últimos 10 Chamados**: Detalhes da semana atual
- Status visual (verde = resolvido, amarelo = em atendimento)

## 🚀 Como Usar

### Opção 1: Abrir Diretamente
```
1. Clique com botão direito em: dashboard-diretor.html
2. Selecione: "Abrir com" → Navegador
3. Clique em: "Carregar CSV"
4. Selecione: chamados_todos_inicio_a_2026-07-02.csv
5. Dashboard carrega automaticamente
```

### Opção 2: Com Servidor Local
```
1. Abra PowerShell na pasta
2. Digite: python -m http.server 8000
3. Acesse: http://localhost:8000/dashboard-diretor.html
4. Clique em "Carregar CSV"
```

## 📋 Dados Exibidos

### Semana Anterior
- Data de início e fim
- Calendário com dias
- KPIs de CS e Suporte
- Gráfico de problemas

### Semana Atual
- Data de início e fim
- Calendário com dias (hoje destacado em azul)
- KPIs de CS e Suporte
- Gráfico de problemas
- Tabela com detalhes dos chamados

## 🎨 Design

- **Cores**: Azul profissional (#1a3a52) com destaque em ciano (#00d4ff)
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Limpo**: Foco em dados, sem distrações
- **Moderno**: Gradientes e sombras sutis

## 📊 Exemplo de Dados

```
Semana Anterior:
- Chamados CS: 8
- Chamados Suporte: 3
- Resolvidos: 10
- Em Atendimento: 1

Semana Atual:
- Chamados CS: 26
- Chamados Suporte: 7
- Resolvidos: 30
- Em Atendimento: 3
```

## 💡 Dicas

- Os calendários mostram automaticamente a semana atual
- O dia de hoje é destacado em azul
- Os gráficos mostram os 5 tipos mais comuns
- A tabela mostra os 10 últimos chamados
- Todos os dados são atualizados quando você carrega o CSV

## 🔄 Atualizar Dados

Para atualizar com novos dados:
1. Clique em "Carregar CSV"
2. Selecione o arquivo atualizado
3. Dashboard atualiza automaticamente

---

**Pronto para apresentar ao diretor!** 🎯
