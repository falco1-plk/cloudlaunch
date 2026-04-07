const http = require('http');
const { exec } = require('child_process');

let isLoggedIn = false;

const server = http.createServer((req, res) => {

  // ---------- LOGIN ----------
  if (req.url === "/login") {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
    <html>
    <head>
    <meta charset="UTF-8">
    <style>
    body {
      font-family: 'Segoe UI';
      background: linear-gradient(135deg,#eef2ff,#e0f7fa);
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }
    .box {
      background:white;
      padding:30px;
      border-radius:12px;
      box-shadow:0 0 20px rgba(0,0,0,0.1);
      text-align:center;
    }
    input {
      padding:10px;
      margin:10px;
      width:200px;
    }
    button {
      padding:10px 20px;
      background:#4f46e5;
      color:white;
      border:none;
      border-radius:8px;
    }
    </style>
    </head>

    <body>
    <div class="box">
      <h2>🔐 Admin Login</h2>
      <form method="POST" action="/auth">
        <input name="user" placeholder="Username"><br>
        <input name="pass" type="password" placeholder="Password"><br>
        <button>Login</button>
      </form>
    </div>
    </body>
    </html>
    `);
  }

  // ---------- AUTH ----------
  if (req.url === "/auth" && req.method === "POST") {
    let body = "";
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (body.includes("admin") && body.includes("1234")) {
        isLoggedIn = true;
        res.writeHead(302, { Location: '/admin' });
        res.end();
      } else {
        res.end("❌ Invalid Login");
      }
    });
    return;
  }

  // ---------- ADMIN ----------
  if (req.url === "/admin") {
    if (!isLoggedIn) {
      res.writeHead(302, { Location: '/login' });
      return res.end();
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
    <html>
    <head>
    <meta charset="UTF-8">

    <style>
    body {
      font-family: 'Segoe UI';
      background:#f4f7fb;
      text-align:center;
      padding:40px;
    }

    button {
      padding:15px;
      margin:10px;
      background:#4f46e5;
      color:white;
      border:none;
      border-radius:10px;
      cursor:pointer;
    }

    #log {
      margin-top:20px;
      background:black;
      color:lime;
      padding:15px;
      height:200px;
      overflow:auto;
      text-align:left;
    }
    </style>

    </head>

    <body>

    <h1>🚀 DevOps Control Panel</h1>

    <button onclick="run('/start')">▶ Start</button>
    <button onclick="run('/stop')">⛔ Stop</button>
    <button onclick="run('/restart')">🔄 Restart</button>
    <button onclick="run('/deploy')">🚀 Deploy</button>

    <h3>Status: <span id="status">Checking...</span></h3>

    <div id="log">Logs will appear here...</div>

    <script>
    function run(route){
      document.getElementById("status").innerText="Processing...";
      fetch(route)
      .then(res=>res.text())
      .then(data=>{
        document.getElementById("status").innerText=data;
        document.getElementById("log").innerText += "\\n" + data;
      });
    }

    setInterval(()=>{
      fetch('/status')
      .then(res=>res.text())
      .then(data=>{
        document.getElementById("status").innerText=data;
      });
    },3000);
    </script>

    </body>
    </html>
    `);
  }

  // ---------- STATUS ----------
  if (req.url === "/status") {
    exec("docker ps -q", (err, stdout) => {
      if (stdout.trim()) {
        res.end("🟢 Running");
      } else {
        res.end("🔴 Stopped");
      }
    });
    return;
  }

  // ---------- ACTIONS ----------
  if (req.url === "/stop") {
    exec("docker stop $(docker ps -q)", () => {});
    return res.end("❌ Stopped");
  }

  if (req.url === "/start") {
    exec("docker start $(docker ps -aq)", () => {});
    return res.end("✅ Started");
  }

  if (req.url === "/restart") {
    exec("docker restart $(docker ps -q)", () => {});
    return res.end("🔄 Restarted");
  }

  if (req.url === "/deploy") {
    exec("git pull && docker build -t cloudlaunch . && docker run -d -p 3000:3000 cloudlaunch", () => {});
    return res.end("🚀 Deployed");
  }

  // ---------- MAIN ----------
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  res.end(`
  <html>
  <head><meta charset="UTF-8"></head>
  <body style="text-align:center;font-family:sans-serif">
  <h1>🚀 CloudLaunch DevOps App</h1>
  <p>Live System Running</p>
  <a href="/login">Go to Admin</a>
  </body>
  </html>
  `);

});

server.listen(3000, () => {
  console.log("🔥 Running on port 3000");
});