const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const serverIndexPath = path.resolve(__dirname, '../server/dist/index.js');
console.log('Starting KrishiMitra backend server for health verification...');
console.log('Server file:', serverIndexPath);

const serverProcess = spawn('node', [serverIndexPath], { stdio: 'inherit' });

setTimeout(() => {
  http.get('http://localhost:5000/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n--- HEALTH CHECK RESPONSE ---');
      console.log('HTTP Status:', res.statusCode);
      console.log('Headers:', res.headers['content-type']);
      console.log('Body:', data);
      console.log('-----------------------------\n');
      serverProcess.kill('SIGTERM');
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  }).on('error', (err) => {
    console.error('Failed to reach health endpoint:', err.message);
    serverProcess.kill('SIGTERM');
    process.exit(1);
  });
}, 2000);
