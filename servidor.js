// Servidor web simples (sem dependências) usado como aplicação sob teste.
// Serve os arquivos estáticos da pasta /app e expõe uma pequena API.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PASTA = path.join(__dirname, 'app');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function responderJSON(res, status, corpo) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(corpo));
}

function lerCorpo(req) {
  return new Promise((resolve) => {
    let dados = '';
    req.on('data', (parte) => (dados += parte));
    req.on('end', () => {
      try { resolve(JSON.parse(dados || '{}')); } catch { resolve({}); }
    });
  });
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // --- API ---
  if (url.pathname === '/api/status' && req.method === 'GET') {
    return responderJSON(res, 200, { status: 'ok', hora: new Date().toISOString() });
  }

  if (url.pathname === '/api/contato' && req.method === 'POST') {
    const { nome, email, assunto, mensagem } = await lerCorpo(req);
    const erros = {};
    if (!nome || nome.trim().length < 3) erros.nome = 'Informe seu nome completo (mínimo 3 letras).';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'Informe um e-mail válido.';
    if (!assunto) erros.assunto = 'Selecione um assunto.';
    if (!mensagem || mensagem.trim().length < 10) erros.mensagem = 'A mensagem deve ter pelo menos 10 caracteres.';
    if (Object.keys(erros).length) return responderJSON(res, 400, { ok: false, erros });
    return responderJSON(res, 200, { ok: true, protocolo: 'PRT-' + Date.now().toString().slice(-6) });
  }

  // --- Arquivos estáticos ---
  let caminho = url.pathname === '/' ? '/index.html' : url.pathname;
  const arquivo = path.normalize(path.join(PASTA, caminho));
  if (!arquivo.startsWith(PASTA)) { res.writeHead(403); return res.end('Acesso negado'); }

  fs.readFile(arquivo, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.readFile(path.join(PASTA, '404.html'), (e, pagina) => res.end(e ? 'Página não encontrada' : pagina));
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(conteudo);
  });
});

servidor.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
