# 📦 Instruções de Instalação

## ✅ Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Arquivo CSV ou Excel com dados dos chamados
- Nenhuma instalação adicional necessária!

## 🚀 Passo a Passo

### Passo 1: Preparar os Arquivos

1. Coloque todos os arquivos do dashboard na mesma pasta:
   - `index.html`
   - `styles.css`
   - `data-processor.js`
   - `charts.js`
   - `dashboard.js`
   - `test.html` (opcional, mas recomendado)
   - Seu arquivo CSV com dados

### Passo 2: Abrir o Dashboard

#### Opção A: Usar o Teste (Recomendado)
```
1. Clique com botão direito em test.html
2. Selecione "Abrir com" → Navegador
3. Clique em "Carregar Arquivo CSV"
4. Selecione seu arquivo de dados
5. Pronto! Dashboard abre automaticamente
```

#### Opção B: Abrir Diretamente
```
1. Clique com botão direito em index.html
2. Selecione "Abrir com" → Navegador
3. Clique em "Carregar" na barra superior
4. Selecione seu arquivo de dados
```

#### Opção C: Usar Servidor Local (Melhor Experiência)

**Windows (PowerShell):**
```powershell
cd "d:\Documentos\Apresentação"
python -m http.server 8000
```

**Windows (CMD):**
```cmd
cd d:\Documentos\Apresentação
python -m http.server 8000
```

**macOS/Linux:**
```bash
cd ~/Documentos/Apresentação
python3 -m http.server 8000
```

Depois acesse no navegador: `http://localhost:8000`

### Passo 3: Carregar Dados

1. Clique no botão **"Carregar"** (ícone de upload)
2. Selecione seu arquivo CSV ou Excel
3. Aguarde o carregamento
4. Dashboard será atualizado automaticamente

### Passo 4: Usar o Dashboard

- **Filtros**: Selecione valores e clique "Aplicar"
- **Pesquisa**: Digite na caixa de pesquisa rápida
- **Exportar**: Clique nos ícones de PDF ou Excel
- **Tela Cheia**: Clique no ícone de expansão
- **Tema**: Clique no ícone de lua

---

## 📋 Formato do Arquivo CSV

Seu arquivo deve ter este formato (separado por `;`):

```csv
Protocolo;Status;Tipo;Cliente;Empresa do cliente;Resumo;Descrição;Técnico responsável;Equipamento;Sistema(s);Nº de Série;Cidade;Estado;Data de abertura;Data de fechamento;Equipe
CH-001;Em Atendimento;Equipamento;JOÃO;Empresa A;Problema;Descrição;Técnico 1;ETAN;OPENBIO;SN123;Cuiabá;MT;01/07/2026, 16:30;;suporte
CH-002;Resolvido;Sistema;MARIA;Empresa B;Reunião;Descrição;Técnico 2;ETAN;PLATAFORMA;SN456;São Paulo;SP;26/06/2026, 16:32;26/06/2026;CS
```

**Importante:**
- Delimitador: `;` (ponto e vírgula)
- Datas: `DD/MM/YYYY` ou `DD/MM/YYYY, HH:MM:SS`
- Equipe: `CS` ou `suporte` (case-insensitive)
- Data de fechamento: deixe vazia para chamados abertos

---

## 🔧 Verificar Instalação

1. Abra o navegador
2. Abra o arquivo `test.html`
3. Clique em "🧪 Testar Parsing"
4. Você deve ver a saída do teste
5. Se tudo funcionar, está pronto!

---

## 🌐 Acessar de Outro Computador

Se estiver usando servidor local:

1. Descubra o IP do seu computador:
   - Windows: `ipconfig` (procure por "IPv4 Address")
   - macOS/Linux: `ifconfig` (procure por "inet")

2. No outro computador, acesse:
   ```
   http://seu-ip:8000
   ```

---

## ⚠️ Problemas Comuns

### "Arquivo não encontrado"
- Certifique-se de que o arquivo está na mesma pasta
- Verifique o nome do arquivo (case-sensitive em alguns sistemas)

### "Nenhum dado aparece"
- Verifique o delimitador do CSV (deve ser `;`)
- Verifique os nomes das colunas
- Abra o console (F12) para ver erros

### "Servidor não inicia"
- Certifique-se de que Python está instalado
- Tente usar `python3` em vez de `python`
- Verifique se a porta 8000 está disponível

### "Gráficos não aparecem"
- Atualize a página (F5)
- Verifique se há dados carregados
- Tente limpar os filtros

---

## 📚 Arquivos Inclusos

```
dashboard/
├── index.html              # Página principal
├── styles.css              # Estilos
├── data-processor.js       # Processamento de dados
├── charts.js               # Gráficos
├── dashboard.js            # Lógica principal
├── test.html               # Página de teste
├── dados-exemplo.csv       # Dados de exemplo
├── chamados_todos_inicio_a_2026-07-02.csv  # Seus dados
├── README.md               # Documentação completa
├── GUIA_RAPIDO.md         # Guia de uso rápido
└── INSTALACAO.md          # Este arquivo
```

---

## 🎯 Próximos Passos

1. ✅ Preparar arquivo de dados
2. ✅ Abrir dashboard
3. ✅ Carregar dados
4. ✅ Explorar funcionalidades
5. ✅ Exportar relatórios
6. ✅ Usar em apresentações

---

## 💡 Dicas

- **Backup**: Sempre mantenha backup do arquivo de dados
- **Atualização**: Atualize o arquivo CSV regularmente
- **Filtros**: Use filtros para focar em dados específicos
- **Exportação**: Exporte PDF para apresentações
- **Tema**: Use tema claro para projeções

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console (F12)
2. Leia o README.md
3. Consulte o GUIA_RAPIDO.md
4. Tente com o arquivo de exemplo

---

**Versão**: 1.0.0  
**Data**: Julho 2026  
**Desenvolvido para**: INFANT.ID
