const http = require('http');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {

  // ================= ADMIN PANEL =================
  if (req.url === "/admin") {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    return res.end(`
<!DOCTYPE html>
<html>
<head>
<title>Admin Panel</title>
<style>
body {
  margin:0;
  font-family:'Segoe UI';
  background: linear-gradient(135deg,#1e3c72,#2a5298);
  color:white;
  text-align:center;
}

h1 {
  margin-top:30px;
  color:#00ffe0;
  text-shadow:0 0 20px #00ffe0;
}

button {
  padding:15px 25px;
  margin:15px;
  border:none;
  border-radius:12px;
  font-size:18px;
  cursor:pointer;
  color:white;
  transition:0.3s;
}

.start { background:#22c55e; }
.stop { background:#ef4444; }
.restart { background:#3b82f6; }
.deploy { background:#f59e0b; }

button:hover {
  transform:scale(1.1);
  box-shadow:0 0 20px white;
}

.log {
  margin-top:30px;
  background:black;
  padding:20px;
  height:200px;
  overflow:auto;
  border-radius:10px;
  color:#00ff00;
}
</style>
</head>

<body>

<h1>⚙️ DevOps Control Panel</h1>

<button class="start" onclick="run('/start')">▶ Start</button>
<button class="stop" onclick="run('/stop')">⛔ Stop</button>
<button class="restart" onclick="run('/restart')">🔄 Restart</button>
<button class="deploy" onclick="run('/deploy')">🚀 Deploy</button>

<div class="log" id="log">Logs...</div>

<script>
function run(url){
  fetch(url)
  .then(res=>res.text())
  .then(data=>{
    document.getElementById("log").innerHTML += "<br>" + data;
  });
}
</script>

</body>
</html>
`);
  }

  // ================= COMMANDS =================
  if (req.url === "/stop") {
    exec("docker stop $(docker ps -q)");
    return res.end("❌ Server Stopped");
  }

  if (req.url === "/start") {
    exec("docker start $(docker ps -aq)");
    return res.end("✅ Server Started");
  }

  if (req.url === "/restart") {
    exec("docker restart $(docker ps -q)");
    return res.end("🔄 Server Restarted");
  }

  if (req.url === "/deploy") {
    exec("git pull && docker build -t cloudlaunch . && docker run -d -p 3000:3000 cloudlaunch");
    return res.end("🚀 Deployment Triggered");
  }

  // ================= DASHBOARD =================
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
  font-size:40px;
  color:#00f2ff;
  text-shadow:0 0 20px #00f2ff;
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
  box-shadow:0 0 20px rgba(0,255,255,0.3);
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
<h2>👨‍💻 Developer</h2>
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
  chart.data.datasets[0].data.push(Math.floor(Math.random()*100));
  chart.update();
},2000);
</script>

</body>
</html>
`);
});

// 🔥 IMPORTANT (THIS FIXES YOUR ISSUE)
server.listen(3000, '0.0.0.0', () => {
  console.log("🚀 Server running on port 3000");
});