const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
  <h1>CloudLaunch FINAL DEMO 🚀</h1>
  <p>Auto deployment working successfully!</p>
`);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
