// Gera "prints" (imagens PNG) das execuções: converte os logs do terminal em imagens
// e tira screenshot do relatório HTML do Playwright.
// Uso: node scripts/gerar-prints.js
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const saida = path.join(raiz, 'prints');

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function logParaHTML(titulo, texto) {
  const linhas = texto.split('\n').map((l) => {
    let cls = '';
    if (/^\s*✓/.test(l)) cls = 'ok';
    else if (/^\s*✘/.test(l) || /^\s*\d+\) /.test(l) || /Error:/.test(l) || /\d+ failed/.test(l)) cls = 'erro';
    else if (/\d+ passed/.test(l)) cls = 'ok';
    return `<div class="${cls}">${esc(l) || '&nbsp;'}</div>`;
  });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#0d1117;font-family:"DejaVu Sans Mono",Menlo,Consolas,monospace;font-size:13px;color:#c9d1d9}
    .barra{background:#161b22;padding:10px 16px;border-bottom:1px solid #30363d;font-size:13px;color:#8b949e}
    .barra b{color:#58a6ff}
    pre,.log{padding:16px;white-space:pre-wrap;word-break:break-word;line-height:1.5}
    .ok{color:#3fb950}.erro{color:#f85149}
  </style></head><body>
    <div class="barra"><b>$</b> npx playwright test &nbsp;—&nbsp; ${esc(titulo)}</div>
    <div class="log">${linhas.join('')}</div>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });

  const logs = [
    ['execucao-1-com-falha', '1ª execução: 39 passaram, 1 falhou'],
    ['execucao-2-corrigida', '2ª execução (após correção): 40 passaram'],
  ];
  for (const [arquivo, titulo] of logs) {
    const caminho = path.join(saida, 'logs', arquivo + '.txt');
    if (!fs.existsSync(caminho)) continue;
    await page.setContent(logParaHTML(titulo, fs.readFileSync(caminho, 'utf-8')));
    await page.screenshot({ path: path.join(saida, 'terminal-' + arquivo + '.png'), fullPage: true });
  }

  const relatorio = path.join(raiz, 'playwright-report', 'index.html');
  if (fs.existsSync(relatorio)) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('file://' + relatorio);
    await page.waitForSelector('.test-file-test');
    await page.screenshot({ path: path.join(saida, 'relatorio-html-playwright.png'), fullPage: true });
  }
  await browser.close();
  console.log('Prints gerados em', saida);
})();
