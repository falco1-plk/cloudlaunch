const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end(`
    <html>
    <head>
    <title>CloudLaunch CI/CD</title>

    <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: white;
      text-align: center;
    }

    h1 {
      margin-top: 40px;
      font-size: 42px;
      animation: glow 2s infinite alternate;
    }

    .container {
      margin: 40px auto;
      width: 60%;
      padding: 30px;
      border-radius: 15px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      animation: fadeIn 2s ease-in-out;
    }

    .team {
      margin-top: 20px;
      text-align: left;
      padding: 15px;
    }

    .team p {
      font-size: 18px;
      margin: 5px 0;
    }

    .footer {
      margin-top: 30px;
      font-size: 18px;
      color: #00ffcc;
      animation: blink 1.5s infinite;
    }

    @keyframes glow {
      from { text-shadow: 0 0 10px #00f2ff; }
      to { text-shadow: 0 0 25px #00f2ff, 0 0 40px #00f2ff; }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
    </style>
    </head>

    <body>

    <h1> CloudLaunch CI/CD Pipeline</h1>

    <div class="container">

      <h2>Project Details</h2>

      <p><b>Student Name:</b> AISHWARY JAISWAL</p>
      <p><b>Registration No:</b> 24BSA10135</p>

      <div class="team">
        <h3>Team Members</h3>

        <p>1. MEMBER 1 yash (Reg No)</p>
        <p>2. MEMBER 2 AK (Reg No)</p>
        <p>3. MEMBER 3 KK (Reg No)</p>
        <p>4. MEMBER 4 OP (Reg No)</p>
        <p>5. MEMBER 5 NAMA (Reg No)</p>

      </div>

      <div class="footer">
        Auto Deployment Working Successfully
      </div>

    </div>

    </body>
    </html>
    `);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});