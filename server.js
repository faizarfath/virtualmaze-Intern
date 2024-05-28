const { createServer } = require('node:http');
const { readFile } = require('node:fs').promises;
const path = require('node:path');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer(async (req, res) => {
  try {
    if (req.url === '/' || req.url === '/index.html') {
      const data = await readFile(path.join(__dirname, 'index.html'), 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    } else if (req.url === '/style.css') {
      const data = await readFile(path.join(__dirname, 'style.css'), 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/css');
      res.end(data);
    } else if (req.url === '/javascript.js') {
      const data = await readFile(path.join(__dirname, 'javascript.js'), 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      res.end(data);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
    }
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('500 Internal Server Error');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
