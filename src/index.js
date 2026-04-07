const http = require('http');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {

  // ---------- ADMIN PANEL ----------
  if (req.url === "/admin") {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>

    <style>
    body {
      font-family: 'Segoe UI';
      background: linear-gradient(135deg,#eef2ff,#e0f7fa);
      text-align:center;
      padding:50px;
    }

    h1 { color:#4f46e5; }

    button {
      padding:15px 25px;
      margin:10px;
      border:none;
      background:#4f46e5;
      color:white;
      border-radius:10px;
      cursor:pointer;
      font-size:16px;
      transition:0.3s;
    }

    button:hover {
      background:#4338ca;
      transform:scale(1.05);
    }

    .status {
      margin-top:20px;
      font-size:18px;
      color:#10b981;
    }
    </style>

    </head>

    <body>

    <h1>🚀 DevOps Control Panel</h1>

    <button onclick="action('/start')">▶ Start</button>
    <button onclick="action('/stop')">⛔ Stop</button>
    <button onclick="action('/restart')">🔄 Restart</button>
    <button onclick="action('/deploy')">🚀 Deploy</button>

    <p class="status" id="msg">Waiting for action...</p>

    <script>
    function action(route){
      fetch(route)
      .then(res => res.text())
      .then(data => {
        document.getElementById("msg").innerText = data;
      });
    }
    </script>

    </body>
    </html>
    `);
  }

  // ---------- STOP ----------
  if (req.url === "/stop") {
    exec("docker stop $(docker ps -q)", () => {});
    return res.end("❌ Server Stopped");
  }

  // ---------- START ----------
  if (req.url === "/start") {
    exec("docker start $(docker ps -aq)", () => {});
    return res.end("✅ Server Started");
  }

  // ---------- RESTART ----------
  if (req.url === "/restart") {
    exec("docker restart $(docker ps -q)", () => {});
    return res.end("🔄 Server Restarted");
  }

  // ---------- DEPLOY ----------
  if (req.url === "/deploy") {
    exec("git pull && docker build -t cloudlaunch . && docker run -d -p 3000:3000 cloudlaunch", () => {});
    return res.end("🚀 Deployment Triggered");
  }

  // ---------- MAIN DASHBOARD ----------
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  res.end(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>CloudLaunch Dashboard</title>

<style>
body {
  margin:0;
  font-family:'Segoe UI';
  background: linear-gradient(135deg,#eef2ff,#e0f7fa);
}

header {
  background:#4f46e5;
  color:white;
  padding:20px;
  text-align:center;
  font-size:28px;
}

.container {
  width:90%;
  margin:20px auto;
}

.grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
}

.card {
  background:white;
  padding:20px;
  border-radius:12px;
  box-shadow:0 4px 15px rgba(0,0,0,0.1);
  transition:0.3s;
}

.card:hover {
  transform:translateY(-5px);
}

.status {
  color:#10b981;
  font-weight:bold;
}

.cpu {
  font-size:24px;
  color:#4f46e5;
}
</style>

<script>
setInterval(()=>{
  document.getElementById("cpu").innerText =
    Math.floor(Math.random()*100)+"%";
},2000);
</script>

</head>

<body>

<header>🚀 CloudLaunch DevOps Dashboard</header>

<div class="container">

<div class="grid">

<div class="card">
<h3>👨‍💻 Developer</h3>
<p><b>Name:</b> Your Name</p>
<p><b>Reg No:</b> Your Reg No</p>
</div>

<div class="card">
<h3>🌐 Status</h3>
<p class="status">🟢 Running</p>
</div>

<div class="card">
<h3>📊 CPU Usage</h3>
<p id="cpu" class="cpu">0%</p>
</div>

</div>

</div>

</body>
</html>
`);

});

server.listen(3000, () => {
  console.log("🔥 Server running at http://localhost:3000");
});