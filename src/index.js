const http = require('http');
const { exec } = require('child_process');

let isLoggedIn = false;

const server = http.createServer((req, res) => {

  // ---------- LOGIN ----------
  if (req.url === "/login") {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>CloudLaunch DevOps</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body {
  margin:0;
  font-family:'Segoe UI';
  background: linear-gradient(270deg,#0f2027,#203a43,#2c5364);
  background-size: 600% 600%;
  animation: bgMove 10s ease infinite;
  color:white;
}

@keyframes bgMove {
  0% {background-position:0% 50%;}
  50% {background-position:100% 50%;}
  100% {background-position:0% 50%;}
}

header {
  text-align:center;
  padding:20px;
  font-size:32px;
  font-weight:bold;
  text-shadow:0 0 10px cyan;
}

.container {
  width:90%;
  margin:auto;
}

.grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
}

.card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius:15px;
  padding:20px;
  box-shadow:0 0 20px rgba(0,255,255,0.2);
  transition:0.3s;
}

.card:hover {
  transform:scale(1.03);
  box-shadow:0 0 30px cyan;
}

.status {
  font-size:20px;
  color:#00ffcc;
}

canvas {
  background:black;
  border-radius:10px;
}
</style>

</head>

<body>

<header>🚀 CloudLaunch DevOps Monitor</header>

<div class="container">

<div class="grid">

<div class="card">
<h2>👨‍💻 Developer</h2>
<p>Name: Aishwary</p>
<p>Reg No: YOUR REG NO</p>
</div>

<div class="card">
<h2>🌐 System Status</h2>
<p class="status" id="status">Checking...</p>
</div>

<div class="card">
<h2>📊 CPU Usage</h2>
<canvas id="cpuChart"></canvas>
</div>

<div class="card">
<h2>📊 Memory Usage</h2>
<canvas id="memChart"></canvas>
</div>

</div>

</div>

<script>
const cpu = new Chart(document.getElementById("cpuChart"), {
  type: 'line',
  data: {
    labels: Array(10).fill(""),
    datasets: [{
      data: Array(10).fill(50),
      borderColor: '#00ffcc',
      tension: 0.4
    }]
  },
  options:{plugins:{legend:{display:false}}}
});

const mem = new Chart(document.getElementById("memChart"), {
  type: 'line',
  data: {
    labels: Array(10).fill(""),
    datasets: [{
      data: Array(10).fill(30),
      borderColor: '#ffcc00',
      tension: 0.4
    }]
  },
  options:{plugins:{legend:{display:false}}}
});

function update(chart){
  chart.data.datasets[0].data.shift();
  chart.data.datasets[0].data.push(Math.random()*100);
  chart.update();
}

setInterval(()=>{
  update(cpu);
  update(mem);

  fetch('/status')
  .then(res=>res.text())
  .then(data=>{
    document.getElementById("status").innerText = data;
  });

},2000);
</script>

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