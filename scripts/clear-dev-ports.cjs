const { execSync } = require('node:child_process');
const os = require('node:os');

const ports = [3000, 3001, 3002, 4000, 4001];

function run(command) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

function killPort(port) {
  if (os.platform() === 'win32') {
    const output = run(`netstat -ano -p tcp | findstr :${port}`);
    if (!output) return;

    const lines = output.split(/\r?\n/).filter(Boolean);
    const pids = [...new Set(lines.map((line) => line.trim().split(/\s+/).pop()).filter(Boolean))];

    for (const pid of pids) {
      if (!/^\d+$/.test(pid)) continue;
      run(`taskkill /F /PID ${pid}`);
    }
    return;
  }

  const output = run(`lsof -nP -iTCP:${port} -sTCP:LISTEN`);
  if (!output) return;

  const lines = output.split(/\r?\n/).filter(Boolean);
  const pids = lines
    .slice(1)
    .map((line) => line.trim().split(/\s+/)[1])
    .filter(Boolean);

  for (const pid of pids) {
    run(`kill -9 ${pid}`);
  }
}

for (const port of ports) {
  killPort(port);
}
