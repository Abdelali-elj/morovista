const { spawn, exec } = require('child_process');
const path = require('path');

// Colors for terminal output using ANSI escape codes
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
};

// Formats and outputs logs with colorful prefixes
function log(prefix, color, message) {
    const lines = message.toString().split('\n');
    lines.forEach(line => {
        const trimmed = line.trimEnd();
        if (trimmed) {
            console.log(`${color}${COLORS.bright}${prefix}${COLORS.reset} ${trimmed}`);
        }
    });
}

console.log(`${COLORS.green}${COLORS.bright}====================================================`);
console.log(`🚀 Starting Laravel Backend & Vite Frontend...`);
console.log(`====================================================${COLORS.reset}\n`);

// 1. Start Laravel Backend (php artisan serve)
const backendPath = path.join(__dirname, 'Pfe-Laravel');
console.log(`${COLORS.gray}[System] Spawning Backend (Laravel) in: ${backendPath}${COLORS.reset}`);
const backendProcess = spawn('php', ['artisan', 'serve'], {
    cwd: backendPath,
    shell: true
});

backendProcess.stdout.on('data', (data) => log('[Backend]', COLORS.yellow, data));
backendProcess.stderr.on('data', (data) => log('[Backend ERROR]', COLORS.red, data));

// 2. Start Vite Frontend (npm run dev)
const frontendPath = path.join(__dirname, 'Pfe-Vite');
console.log(`${COLORS.gray}[System] Spawning Frontend (Vite) in: ${frontendPath}${COLORS.reset}\n`);
const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: frontendPath,
    shell: true
});

frontendProcess.stdout.on('data', (data) => log('[Frontend]', COLORS.cyan, data));
frontendProcess.stderr.on('data', (data) => log('[Frontend ERROR]', COLORS.red, data));

// Cleanly kill child processes (including process trees on Windows)
function killProcess(proc, name) {
    if (!proc) return;
    
    console.log(`${COLORS.gray}[System] Stopping ${name}...${COLORS.reset}`);
    
    if (process.platform === 'win32') {
        // On Windows, use taskkill /T /F to kill the entire child process tree
        exec(`taskkill /pid ${proc.pid} /T /F`, (err) => {
            if (err) {
                // Fallback to basic process kill if taskkill fails
                proc.kill();
            }
        });
    } else {
        proc.kill('SIGTERM');
    }
}

// Keep track of exiting state to prevent recursion
let isExiting = false;

function handleExit() {
    if (isExiting) return;
    isExiting = true;
    
    console.log(`\n${COLORS.yellow}${COLORS.bright}====================================================`);
    console.log(`🛑 Stopping all servers and cleaning up...`);
    console.log(`====================================================${COLORS.reset}`);
    
    killProcess(backendProcess, 'Backend (Laravel)');
    killProcess(frontendProcess, 'Frontend (Vite)');
    
    setTimeout(() => {
        console.log(`${COLORS.green}${COLORS.bright}✨ All servers stopped successfully. Bye! 👋${COLORS.reset}\n`);
        process.exit(0);
    }, 1000);
}

// Listen to various exit signals
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', () => {
    if (!isExiting) {
        killProcess(backendProcess, 'Backend (Laravel)');
        killProcess(frontendProcess, 'Frontend (Vite)');
    }
});

// Handle premature termination of sub-processes
backendProcess.on('close', (code) => {
    if (!isExiting) {
        console.log(`\n${COLORS.red}${COLORS.bright}[Backend] Server stopped unexpectedly with exit code ${code}${COLORS.reset}`);
        handleExit();
    }
});

frontendProcess.on('close', (code) => {
    if (!isExiting) {
        console.log(`\n${COLORS.red}${COLORS.bright}[Frontend] Server stopped unexpectedly with exit code ${code}${COLORS.reset}`);
        handleExit();
    }
});
