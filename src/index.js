const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
  <html>
    <head>
      <title>CloudLaunch Demo</title>
      <style>
        body {
          font-family: Arial;
          text-align: center;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          margin-top: 100px;
        }
        h1 {
          font-size: 40px;
          animation: fadeIn 2s ease-in-out;
        }
        p {
          font-size: 20px;
          animation: slideUp 2s ease-in-out;
        }
        .box {
          border: 2px solid white;
          padding: 20px;
          margin: auto;
          width: 50%;
          border-radius: 10px;
          background-color: rgba(0,0,0,0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h1>CloudLaunch CI/CD Pipeline 🚀</h1>
        <p><b>Student Name:</b> AISHWARY JAISWAL</p>
        <p><b>Registration No:</b> 24BSA10135</p>
        <p>Auto Deployment Working Successfully ✅</p>
      </div>
    </body>
  </html>
`);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
