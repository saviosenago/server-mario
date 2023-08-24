const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    let filePath = path.join(__dirname, '../cliente-servidor', req.url);
    
    if (req.url === '/') {
      filePath = path.join(__dirname, '../cliente-servidor/login.html');
    }

    const fileExtension = path.extname(filePath);
    let contentType = 'text/html';

    if (fileExtension === '.css') {
      contentType = 'text/css';
    } else if (fileExtension === '.js') {
      contentType = 'application/javascript';
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } else if (req.method === 'POST' && req.url === '/cadastro') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const parsedData = JSON.parse(data);
        
        const nome = parsedData.nome;
        const email = parsedData.email;
        const senha = parsedData.senha;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Cadastro realizado para ${nome} com sucesso!`, success: true }));
      } catch (error) {
        console.error('Erro ao analisar JSON:', error);
        res.writeHead(400);
        res.end('Erro ao processar dados de cadastro');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Página não encontrada');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
