const http = require('http');

async function check() {
  console.log('Final verification starting...');
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 200 && body.includes('root')) {
        console.log('SUCCESS: Root page delivered correctly.');
      } else {
        console.error('FAILURE: Unexpected response.');
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`FAILURE: Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.end();
}

check();
