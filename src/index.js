const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
        <h1>CloudLaunch - Resume to Cloud Pipeline 🚀</h1>
        <p>Phase 1: Application Module Running Successfully</p>
    `);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
