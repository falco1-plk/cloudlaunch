const http = require('http');
const { exec } = require('child_process');

let logs = "System Ready...\n";

function run(cmd, res) {
  exec(cmd, (err, stdout, stderr) => {
    if (err) logs += "ERROR: " + err.message + "\n";
    else logs += stdout + "\n";
    res.end("OK");
  });
}

const server = http.createServer((req, res) => {

  // ===== ADMIN PANEL =====
  if (req.url === "/admin") {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`
    <html>
    <head>
    <style>
      body {
        font-family: Arial;
        background: linear-gradient(135deg,#0f172a,#1e293b);
        color:white;
        text-align:center;
        padding:40px;
      }
      h1 { color:#22d3ee; }
      button {
        padding:12px 25px;
        margin:10px;
        border:none;
        border-radius:8px;
        font-size:16px;
        cursor:pointer;
      }
      .start {background:#22c55e;}
      .stop {background:#ef4444;}
      .restart {background:#3b82f6;}
      .deploy {background:#f59e0b;}

      .logs {
        background:black;
        color:#22c55e;
        padding:15px;
        margin-top:20px;
        height:200px;
        overflow:auto;
        border-radius:10px;
        text-align:left;
      }
    </style>
    </head>

    <body>
      <h1>DevOps Control Panel</h1>

      <button class="start" onclick="act('start')">Start</button>
      <button class="stop" onclick="act('stop')">Stop</button>
      <button class="restart" onclick="act('restart')">Restart</button>
      <button class="deploy" onclick="act('deploy')">Deploy</button>

      <div class="logs" id="logs"></div>

      <script>
        function act(a){
          fetch('/'+a).then(load);
        }
        function load(){
          fetch('/logs').then(r=>r.text()).then(d=>{
            document.getElementById('logs').innerText=d;
          });
        }
        setInterval(load,2000);
        load();
      </script>
    </body>
    </html>
    `);
  }

  // ===== COMMANDS =====
  else if (req.url==="/start") run("docker start cloudlaunch-app",res);
  else if (req.url==="/stop") run("docker stop cloudlaunch-app",res);
  else if (req.url==="/restart") run("docker restart cloudlaunch-app",res);
  else if (req.url==="/deploy") run("git pull && docker restart cloudlaunch-app",res);

  // ===== LOGS =====
  else if (req.url==="/logs"){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end(logs);
  }

  // ===== DASHBOARD =====
  else {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`
    <html>
    <head>
    <style>
      body {
        margin:0;
        font-family: Arial;
        background: linear-gradient(135deg,#020617,#0f172a);
        color:white;
        text-align:center;
      }
      h1 {
        color:#38bdf8;
        margin-top:40px;
      }
      .card {
        background:#1e293b;
        margin:20px auto;
        padding:20px;
        width:300px;
        border-radius:10px;
      }
      .status {color:#22c55e;}
      a {
        color:#facc15;
        text-decoration:none;
      }
    </style>
    </head>

    <body>
      <h1>CloudLaunch Dashboard</h1>

      <div class="card">
        <h2>Status</h2>
        <p class="status">Running</p>
      </div>

      <div class="card">
        <h2>Admin Control</h2>
        <a href="/admin">Open Control Panel</a>
      </div>

    </body>
    </html>
    `);
  }

});

server.listen(3000,()=>console.log("Running on 3000"));