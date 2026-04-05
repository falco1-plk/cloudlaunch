const http = require('http');

const server = http.createServer((req, res) => {

  res.writeHead(200, { 'Content-Type': 'text/html' });

  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CloudLaunch DevOps Monitor</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  text-align: center;
  overflow-x: hidden;
}

/* Animated Background */
body::before {
  content: "";
  position: fixed;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0,255,255,0.08), transparent);
  animation: moveBg 12s linear infinite;
}

@keyframes moveBg {
  0% { transform: translate(0,0); }
  50% { transform: translate(-200px,-200px); }
  100% { transform: translate(0,0); }
}

h1 {
  margin-top: 20px;
  font-size: 40px;
  color: #00f2ff;
  text-shadow: 0 0 20px #00f2ff;
}

.container {
  width: 85%;
  margin: auto;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background: rgba(255,255,255,0.08);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(0,255,255,0.2);
  transition: 0.3s;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 0 35px rgba(0,255,255,0.4);
}

.card h2 {
  color: #00ffcc;
}

.status {
  font-size: 18px;
  color: #00ffcc;
}

.version {
  color: #ffd700;
}

.chart-container {
  background: #000;
  border-radius: 10px;
  padding: 10px;
}

/* GitHub card styling */
.github-box {
  font-size: 14px;
  text-align: left;
  margin-top: 10px;
  line-height: 1.6;
}

.footer {
  margin-top: 20px;
  font-size: 18px;
  color: #00ffcc;
}
</style>

</head>

<body>

<h1>🚀 CloudLaunch DevOps Monitor</h1>

<div class="container">

<div class="grid">

<div class="card">
  <h2>👨‍💻 Developer</h2>
  <p><b>Name:</b> Aishwary</p>
  <p><b>Reg No:</b> YOUR REG NO</p>
</div>

<div class="card">
  <h2>🌐 CI/CD Status</h2>
  <p class="status">🟢 Pipeline Running Successfully</p>
  <p class="version">Version: v2.2</p>
</div>

<div class="card">
  <h2>📊 CPU Usage</h2>
  <div class="chart-container">
    <canvas id="cpuChart"></canvas>
  </div>
</div>

<div class="card">
  <h2>📊 Memory Usage</h2>
  <div class="chart-container">
    <canvas id="memChart"></canvas>
  </div>
</div>

<div class="card">
  <h2>📊 Requests/sec</h2>
  <div class="chart-container">
    <canvas id="reqChart"></canvas>
  </div>
</div>

<div class="card">
  <h2>📡 GitHub Live Status</h2>
  <div class="github-box">
    <p><b>Commit:</b> <span id="commitMsg">Loading...</span></p>
    <p><b>Author:</b> <span id="falco1-plk"></span></p>
    <p><b>Time:</b> <span id="time"></span></p>
  </div>
</div>

</div>

<div class="footer">
  ⚡ Real-Time Monitoring + Live CI/CD Active
</div>

</div>

<script>
// ===== Charts =====
function createChart(id) {
  const ctx = document.getElementById(id).getContext('2d');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(10).fill(""),
      datasets: [{
        data: Array(10).fill(50),
        borderColor: '#00ffcc',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 100 }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

const cpuChart = createChart("cpuChart");
const memChart = createChart("memChart");
const reqChart = createChart("reqChart");

function updateChart(chart) {
  chart.data.datasets[0].data.shift();
  chart.data.datasets[0].data.push(Math.floor(Math.random() * 100));
  chart.update();
}

setInterval(() => {
  updateChart(cpuChart);
  updateChart(memChart);
  updateChart(reqChart);
}, 2000);

// ===== GitHub API =====
async function loadGitHubData() {
  try {
    const res = await fetch("https://api.github.com/repos/http://falco1-plk/https://github.com/falco1-plk/cloudlaunch.git/commits?per_page=1");
    const data = await res.json();

    const latest = data[0];

    document.getElementById("commitMsg").innerText = latest.commit.message;
    document.getElementById("author").innerText = latest.commit.author.name;
    document.getElementById("time").innerText =
      new Date(latest.commit.author.date).toLocaleString();

  } catch (err) {
    document.getElementById("commitMsg").innerText = "Unable to load";
  }
}

loadGitHubData();
setInterval(loadGitHubData, 10000);

</script>

</body>
</html>
`);

});

server.listen(3000, () => {
  console.log("🔥 Server running at http://localhost:3000");
});