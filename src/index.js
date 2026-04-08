const http = require('http');
const { exec } = require('child_process');

let logs = "System Ready...\n";

function runCommand(cmd, res) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      logs += "ERROR: " + error.message + "\n";
    } else {
      logs += stdout + "\n";
    }
    res.end("OK");
  });
}

const server = http.createServer((req, res) => {

  // ================= ADMIN PANEL =================
  if (req.url === "/admin") {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
    <html>
    <head>
      <title>DevOps Control Panel</title>
      <style>
        body {
          font-family: Arial;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          text-align: center;
          padding: 40px;
        }
        h1 {
          color: #22d3ee;
        }
        button {
          padding: 12px 25px;
          margin: 10px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
        }
        .start { background: #22c55e; }
        .stop { background: #ef4444; }
        .restart { background: #3b82f6; }
        .deploy { background: #f59e0b; }

        .logs {
          background: black;
          color: #22c55e;
          padding: 15px;
          margin-top: 20px;
          height: 200px;
          overflow-y: auto;
          text-align: left;
          border-radius: 10px;
        }
      </style>
    </head>

    <body>
      <h1>DevOps Control Panel</h1>

      <button class="start" onclick="action('start')">Start</button>
      <button class="stop" onclick="action('stop')">Stop</button>
      <button class="restart" onclick="action('restart')">Restart</button>
      <button class="deploy" onclick="action('deploy')">Deploy</button>

      <div class="logs" id="logs">Logs loading...</div>

      <script>
        function action(type) {
          fetch('/' + type).then(() => {
            loadLogs();
          });
        }

        function loadLogs() {
          fetch('/logs')
          .then(res => res.text())
          .then(data => {
            document.getElementById('logs').innerText = data;
          });
        }

        setInterval(loadLogs, 2000);
        loadLogs();
      </script>
    </body>
    </html>
    `);
  }

  // ================= COMMANDS =================
  else if (req.url === "/start") {
    runCommand("docker start cloudlaunch-app", res);
  }
  else if (req.url === "/stop") {
    runCommand("docker stop cloudlaunch-app", res);
  }
  else if (req.url === "/restart") {
    runCommand("docker restart cloudlaunch-app", res);
  }
  else if (req.url === "/deploy") {
    runCommand("git pull && docker restart cloudlaunch-app", res);
  }

  // ================= LOGS =================
  else if (req.url === "/logs") {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(logs);
  }

  // ================= DASHBOARD =================
  else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
      <body style="background:#111;color:white;text-align:center;padding:50px;">
        <h1>CloudLaunch CI/CD is Running</h1>
        <p>Visit <a href="/admin">Admin Panel</a></p>
      </body>
      </html>
    `);
  }

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});