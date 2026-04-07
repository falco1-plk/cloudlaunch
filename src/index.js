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
      background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      color:white;
    }
    .box {
      background: rgba(255,255,255,0.1);
      padding:30px;
      border-radius:15px;
      backdrop-filter: blur(10px);
      text-align:center;
    }
    input {
      padding:10px;
      margin:10px;
      width:200px;
      border:none;
      border-radius:5px;
    }
    button {
      padding:10px 20px;
      background:#00c6ff;
      border:none;
      border-radius:8px;
      color:white;
      cursor:pointer;
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

  // ---------- ADMIN PANEL ----------
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
      background: #0f172a;
      color: white;
      text-align: center;
      padding: 40px;
    }

    h1 {
      color: cyan;
      text-shadow: 0 0 10px cyan;
    }

    button {
      padding: 15px 25px;
      margin: 15px;
      background: linear-gradient(45deg,#00c6ff,#0072ff);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    #log {
      margin-top: 20px;
      background: black;
      color: lime;
      padding: 15px;
      height: 200px;
      overflow: auto;
      text-align:left;
    }
    </style>

    </head>

    <body>

    <h1>⚙️ CONTROL PANEL (ADMIN)</h1>

    <button onclick="run('/start')">▶ Start</button>
    <button onclick="run('/stop')">⛔ Stop</button>
    <button onclick="run('/restart')">🔄 Restart</button>
    <button onclick="run('/deploy')">🚀 Deploy</button>

    <h3 id="status">Waiting...</h3>

    <div id="log">Logs...</div>

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
    </script>

    </body>
    </html>
    `);
  }

  // ---------- STATUS ----------
  if (req.url === "/status") {
    exec("docker ps --filter name=cloudlaunch-app -q", (err, stdout) => {
      if (stdout.trim()) {
        res.end("Running");
      } else {
        res.end("Stopped");
      }
    });
    return;
  }

  // ---------- FIXED ACTIONS (IMPORTANT) ----------

  if (req.url === "/stop") {
    exec("docker stop cloudlaunch-app", () => {});
    return res.end("❌ App Stopped");
  }

  if (req.url === "/start") {
    exec("docker start cloudlaunch-app", () => {});
    return res.end("✅ App Started");
  }

  if (req.url === "/restart") {
    exec("docker restart cloudlaunch-app", () => {});
    return res.end("🔄 App Restarted");
  }

  if (req.url === "/deploy") {
    exec(`
      docker stop cloudlaunch-app &&
      docker rm cloudlaunch-app &&
      docker build -t cloudlaunch . &&
      docker run -d --name cloudlaunch-app -p 3000:3000 cloudlaunch
    `, () => {});
    return res.end("🚀 Deployment Done");
  }

  // ---------- DASHBOARD ----------
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  res.end(`
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
  body {
    margin:0;
    font-family:'Segoe UI';
    background: linear-gradient(270deg,#0f2027,#203a43,#2c5364);
    color:white;
  }

  header {
    text-align:center;
    padding:20px;
    font-size:32px;
    text-shadow:0 0 10px cyan;
  }

  .grid {
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
    padding:20px;
  }

  .card {
    background: rgba(255,255,255,0.1);
    padding:20px;
    border-radius:15px;
  }

  canvas {
    background:black;
    border-radius:10px;
  }
  </style>

  </head>

  <body>

  <header>🚀 CloudLaunch DevOps Monitor</header>

  <div class="grid">

  <div class="card">
  <h2>👨‍💻 Developer</h2>
  <p>Name: Aishwary</p>
  </div>

  <div class="card">
  <h2>🌐 System Status</h2>
  <p id="status">Checking...</p>
  </div>

  <div class="card">
  <h2>📊 CPU</h2>
  <canvas id="cpu"></canvas>
  </div>

  <div class="card">
  <h2>📊 Memory</h2>
  <canvas id="mem"></canvas>
  </div>

  </div>

  <script>
  const cpuChart = new Chart(document.getElementById("cpu"), {
    type:'line',
    data:{labels:Array(10).fill(""),datasets:[{data:Array(10).fill(50),borderColor:'cyan'}]},
    options:{plugins:{legend:{display:false}}}
  });

  const memChart = new Chart(document.getElementById("mem"), {
    type:'line',
    data:{labels:Array(10).fill(""),datasets:[{data:Array(10).fill(30),borderColor:'yellow'}]},
    options:{plugins:{legend:{display:false}}}
  });

  function update(chart){
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(Math.random()*100);
    chart.update();
  }

  setInterval(()=>{
    update(cpuChart);
    update(memChart);

    fetch('/status')
    .then(res=>res.text())
    .then(data=>{
      let el=document.getElementById("status");
      if(data.includes("Running")){
        el.innerHTML="🟢 Running";
        el.style.color="#00ffcc";
      }else{
        el.innerHTML="🔴 Stopped";
        el.style.color="red";
      }
    });

  },2000);
  </script>

  </body>
  </html>
  `);

});

// 👉 IMPORTANT: ADMIN RUNS ON DIFFERENT PORT
server.listen(4000, () => {
  console.log("🔥 Admin running on port 4000");
});