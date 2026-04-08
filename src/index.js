const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let logs = "System Ready...\n";

function runCommand(cmd, res) {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            logs += "ERROR: " + stderr + "\n";
        } else {
            logs += stdout + "\n";
        }
        res.end("OK");
    });
}

const server = http.createServer((req, res) => {

    // Dashboard
    if (req.url === "/") {
        fs.createReadStream(path.join(__dirname, "public/dashboard.html")).pipe(res);
    }

    // Admin
    else if (req.url === "/admin") {
        fs.createReadStream(path.join(__dirname, "public/admin.html")).pipe(res);
    }

    // Start
    else if (req.url === "/start") {
        runCommand("docker start cloudlaunch-app || docker run -d -p 4000:80 --name cloudlaunch-app nginx", res);
    }

    // Stop
    else if (req.url === "/stop") {
        runCommand("docker stop cloudlaunch-app", res);
    }

    // Restart
    else if (req.url === "/restart") {
        runCommand("docker restart cloudlaunch-app", res);
    }

    // Deploy (fresh container)
    else if (req.url === "/deploy") {
        runCommand("docker rm -f cloudlaunch-app && docker run -d -p 4000:80 --name cloudlaunch-app nginx", res);
    }

    // Logs
    else if (req.url === "/logs") {
        res.end(logs);
    }

    else {
        res.end("404 Not Found");
    }
});

server.listen(3000, () => console.log("Server running on port 3000"));