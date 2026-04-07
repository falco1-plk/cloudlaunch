const http = require('http');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {

  // ---------- ADMIN PANEL ----------
  if (req.url === "/admin") {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    return res.end(`
    <html>
    <head>
    <title>Admin Panel</title>
    <style>
      body {
        font-family: Arial;
        background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
        color:white;
        text-align:center;
        padding:50px;
      }
      h1 { color:#00f2ff; }
      button {
        padding:15px 25px;
        margin:10px;
        border:none;
        border-radius:10px;
        font-size:16px;
        cursor:pointer;
      }
      .start { background:#22c55e; }
      .stop { background:#ef4444; }
      .restart { background:#3b82f6; }
      .deploy { background:#f59e0b; }
    </style>
    </head>
    <body>

    <h1>⚙️ DevOps Control Panel</h1>

    <button class="start" onclick="fetch('/start')">▶ Start</button>
    <button class="stop" onclick="fetch('/stop')">⛔ Stop</button>
    <button class="restart" onclick="fetch('/restart')">🔄 Restart</button>
    <button class="deploy" onclick="fetch('/deploy')">🚀 Deploy</button>

    <p>Control your live system</p>

    </body>
    </html>
    `);
  }

  // ---------- COMMANDS ----------
  if (req.url === "/stop") {
    exec("docker stop $(docker ps -q)");
    return res.end("Stopped ❌");
  }

  if (req.url === "/start") {
    exec("docker start $(docker ps -aq)");
    return res.end("Started ✅");
  }

  if (req.url === "/restart") {
    exec("docker restart $(docker ps -q)");
    return res.end("Restarted 🔄");
  }

  if (req.url === "/deploy") {
    exec("git pull && docker build -t cloudlaunch . && docker run -d -p 3000:3000 cloudlaunch");
    return res.end("Deployed 🚀");
  }

  // ---------- MAIN DASHBOARD ----------
  res.writeHead(200, { 'Content-Type': 'text/html' });

  res.end(`
<!DOCTYPE html>
<html>
<head>
<title>CloudLaunch Dashboard</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body {
  margin:0;
  font-family:'Segoe UI';
  background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
  color:white;
  text-align:center;
}

h1 {
  margin-top:20px;
  color:#00f2ff;
}

.container {
  width:90%;
  margin:auto;
}

.card {
  background: rgba(255,255,255,0.1);
  padding:20px;
  margin:20px;
  border-radius:15px;
}

canvas {
  background:black;
  border-radius:10px;
}
</style>

</head>

<body>

<h1>🚀 CloudLaunch DevOps Dashboard</h1>

<div class="container">

<div class="card">
<h2>👨 Developer</h2>
<p>Aishwary</p>
</div>

<div class="card">
<h2>📊 CPU Usage</h2>
<canvas id="chart"></canvas>
</div>

</div>

<script>
const ctx = document.getElementById('chart');

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(10).fill(""),
    datasets: [{
      data: Array(10).fill(50),
      borderColor: '#00f2ff',
      tension: 0.4
    }]
  },
  options: {
    scales: { y: { min: 0, max: 100 } },
    plugins: { legend: { display: false } }
  }
});

setInterval(()=>{
  chart.data.datasets[0].data.shift();
  chart.data.datasets[0].data.push(Math.random()*100);
  chart.update();
},2000);
</script>

</body>
</html>
`);
});

// IMPORTANT FIX
server.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});