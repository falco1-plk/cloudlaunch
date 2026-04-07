from flask import Flask, request, redirect, session, render_template_string
import datetime

app = Flask(__name__)
app.secret_key = "secret123"

tasks = []

# ---------------- LOGIN ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        user = request.form['username']
        pwd = request.form['password']

        if user == "admin" and pwd == "1234":
            session['user'] = user
            return redirect('/')
        else:
            return "❌ Invalid Login"

    return '''
    <html>
    <head>
    <style>
    body{
        background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
        display:flex;justify-content:center;align-items:center;height:100vh;
        font-family:Arial;color:white;
    }
    .box{
        background:rgba(255,255,255,0.1);
        padding:30px;border-radius:15px;text-align:center;
        box-shadow:0 0 20px rgba(0,255,255,0.3);
        animation:fade 1s ease-in-out;
    }
    input{padding:10px;margin:10px;border:none;border-radius:5px;}
    button{padding:10px;background:#00ffcc;border:none;border-radius:5px;cursor:pointer;}
    button:hover{background:#00e6b8;}
    @keyframes fade{
        from{opacity:0;transform:translateY(20px);}
        to{opacity:1;}
    }
    </style>

    <script>
    function togglePassword(){
        let x=document.getElementById("pwd");
        x.type = (x.type==="password") ? "text" : "password";
    }
    </script>

    </head>

    <body>
    <div class="box">
    <h2>🔐 CloudLaunch Login</h2>

    <form method="POST">
    <input name="username" placeholder="Username"><br>
    <input type="password" id="pwd" name="password" placeholder="Password"><br>

    <input type="checkbox" onclick="togglePassword()"> Show Password<br><br>

    <button>Login</button>
    </form>
    </div>
    </body>
    </html>
    '''

# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

# ---------------- DASHBOARD ----------------
@app.route('/')
def home():

    if 'user' not in session:
        return redirect('/login')

    version = "v3.0"
    time = datetime.datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    return render_template_string(f'''
<!DOCTYPE html>
<html>
<head>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body {{
    margin:0;
    font-family:'Segoe UI';
    background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
    color:white;
}}

h1 {{
    text-align:center;
    padding:20px;
    color:#00f2ff;
    text-shadow:0 0 20px #00f2ff;
}}

.container {{
    width:90%;
    margin:auto;
}}

.grid {{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
}}

.card {{
    background:rgba(255,255,255,0.08);
    padding:20px;
    border-radius:15px;
    box-shadow:0 0 20px rgba(0,255,255,0.2);
    transition:0.3s;
}}

.card:hover {{
    transform:scale(1.03);
}}

.status {{
    color:#00ffcc;
    font-weight:bold;
}}

button {{
    padding:8px;
    background:#00ffcc;
    border:none;
    cursor:pointer;
}}

.pipeline span {{
    display:inline-block;
    padding:10px;
    margin:5px;
    background:#444;
    border-radius:10px;
    animation:pulse 2s infinite;
}}

@keyframes pulse {{
    0%{{background:#444}}
    50%{{background:#00ffcc}}
    100%{{background:#444}}
}}

.logout {{
    position:absolute;
    right:20px;
    top:20px;
}}
</style>

</head>

<body>

<a href="/logout" class="logout"><button>Logout</button></a>

<h1>🚀 CloudLaunch DevOps Monitor</h1>

<div class="container">

<div class="grid">

<div class="card">
<h2>👨 Developer</h2>
<p>Aishwary</p>
<p>Reg No: YOUR REG NO</p>
</div>

<div class="card">
<h2>🌐 CI/CD Status</h2>
<p class="status">🟢 Deployment Success</p>
<p>Version: {version}</p>
<p>Last Deploy: {time}</p>
</div>

<div class="card">
<h2>👥 Team</h2>
<p>1. Member 1</p>
<p>2. Member 2</p>
<p>3. Member 3</p>
<p>4. Member 4</p>
<p>5. Member 5</p>
</div>

<div class="card">
<h2>📝 Task Manager</h2>

<form method="POST" action="/add">
<input name="task" placeholder="New Task">
<button>Add</button>
</form>

<ul>
{''.join([f"<li>{t} <a href='/delete/{i}'>❌</a></li>" for i,t in enumerate(tasks)])}
</ul>

</div>

<div class="card">
<h2>📊 CPU Usage</h2>
<canvas id="cpu"></canvas>
</div>

<div class="card">
<h2>📊 Memory Usage</h2>
<canvas id="mem"></canvas>
</div>

</div>

<h2 style="text-align:center;">🎬 Pipeline Flow</h2>

<div class="pipeline" style="text-align:center;">
<span>GitHub</span> →
<span>Actions</span> →
<span>Docker</span> →
<span>AWS EC2</span> →
<span>Live</span>
</div>

</div>

<script>
function makeChart(id){{
    return new Chart(document.getElementById(id),{{
        type:'line',
        data:{{
            labels:Array(10).fill(""),
            datasets:[{{
                data:Array(10).fill(50),
                borderColor:'#00ffcc'
            }}]
        }},
        options:{{plugins:{{legend:{{display:false}}}}}}
    }});
}}

let cpu = makeChart("cpu");
let mem = makeChart("mem");

setInterval(()=>{{
    cpu.data.datasets[0].data.shift();
    cpu.data.datasets[0].data.push(Math.random()*100);
    cpu.update();

    mem.data.datasets[0].data.shift();
    mem.data.datasets[0].data.push(Math.random()*100);
    mem.update();
}},2000);
</script>

</body>
</html>
''')

# ---------------- TASK ----------------
@app.route('/add', methods=['POST'])
def add():
    tasks.append(request.form['task'])
    return redirect('/')

@app.route('/delete/<int:id>')
def delete(id):
    if len(tasks) > id:
        tasks.pop(id)
    return redirect('/')

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)