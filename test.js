// Minimal smoke test — no extra framework needed, keeps the pipeline simple.
const http = require('http');
const { spawn } = require('child_process');

const server = spawn('node', ['app.js'], { env: { ...process.env, PORT: 4000 } });

setTimeout(() => {
  http.get('http://localhost:4000/health', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Test passed: /health returned 200');
      server.kill();
      process.exit(0);
    } else {
      console.error('❌ Test failed: unexpected status', res.statusCode);
      server.kill();
      process.exit(1);
    }
  }).on('error', (err) => {
    console.error('❌ Test failed:', err.message);
    server.kill();
    process.exit(1);
  });
}, 1000);
