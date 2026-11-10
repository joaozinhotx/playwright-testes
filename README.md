# Testes automatizados com Playwright em servidores web

Atividade de Pesquisa e Prática — testes gráficos e funcionais com **Playwright** em uma aplicação web hospedada em um servidor local.

## O que tem aqui

| Pasta / arquivo | Para que serve |
|---|---|
| `servidor.js` | Servidor web em Node.js (sem dependências) que serve o site e uma pequena API (`/api/status`, `/api/contato`) |
| `app/` | Site de demonstração **Studio Dev** (Início, Serviços, Sobre, Contato e página 404) |
| `playwright.config.js` | Configuração do Playwright (navegador, URL base, servidor automático) |
| `tests/` | 6 arquivos de teste, um para cada item da atividade (40 testes no total) |
| `prints/` | Prints das execuções (terminal e relatório HTML) e screenshots geradas pelo Playwright |
| `scripts/gerar-prints.js` | Converte os logs do terminal e o relatório HTML em imagens PNG |

## Testes

| Arquivo | Item da atividade | Nº de testes |
|---|---|---|
| `01-acesso.spec.js` | Acesso à aplicação | 6 |
| `02-navegacao.spec.js` | Navegação entre páginas e links | 8 |
| `03-elementos.spec.js` | Botões, campos de texto, lista e checkbox | 6 |
| `04-formularios.spec.js` | Preenchimento e envio de formulário | 4 |
| `05-validacao.spec.js` | Mensagens, títulos e elementos esperados | 8 |
| `06-capturas.spec.js` | Captura de tela (screenshots) | 8 |

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
# 1. instalar as dependências do projeto
npm install

# 2. baixar o navegador usado nos testes (Chromium)
npx playwright install chromium

# 3. rodar todos os testes (o servidor sobe sozinho na porta 3000)
npx playwright test

# 4. abrir o relatório HTML
npx playwright show-report
```

Outras formas de executar:

```bash
npx playwright test --headed          # mostra o navegador abrindo
npx playwright test --ui              # modo interativo
npx playwright test tests/04-formularios.spec.js   # só um arquivo
npm start                             # só o servidor, para ver o site em http://localhost:3000
```

As screenshots são salvas em `prints/screenshots/`.

## Testar outra aplicação

Para rodar os mesmos tipos de teste em outro site (ajustando os seletores), informe a URL base:

```bash
BASE_URL=https://meu-site.com npx playwright test        # Linux / macOS
$env:BASE_URL="https://meu-site.com"; npx playwright test # Windows PowerShell
```

## Outros navegadores

No `playwright.config.js`, descomente as linhas de `firefox` e `webkit` e instale-os com `npx playwright install`.

## Publicar no GitHub

```bash
git init
git add .
git commit -m "Atividade: testes automatizados com Playwright"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```
