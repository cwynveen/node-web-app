const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Main page: displays a digital clock, the image being scanned, a button to trigger the scan, and vulnerability metrics.
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Cool Web UI with CVE Metrics</title>
    <style>
      body {
        font-family: sans-serif;
        text-align: center;
        margin: 0;
        padding: 0;
        background: #9370DB; /* Darker lavender */
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        background: rgba(255, 255, 255, 0.9);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
      h1 {
        font-size: 2.5em;
        margin-bottom: 0.5em;
      }
      p {
        font-size: 1.2em;
        margin: 0.5em;
      }
      button {
        font-size: 1em;
        padding: 0.5em 1em;
        margin: 1em 0;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: #fff;
      }
      button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Let's scan some containers!</h1>
      <p id="time">Loading time...</p>
      <p id="image">Scanning image from Chainguard: node:23.10.0</p>
      <button id="scanButton">Scan for Vulnerabilities</button>
      <p id="vuln">Vulnerability metrics will appear here.</p>
    </div>
    <script>
      // Update the clock every second
      function updateTime() {
        const now = new Date();
        document.getElementById('time').textContent = now.toLocaleTimeString();
      }
      setInterval(updateTime, 1000);
      updateTime();

      // Function to perform the vulnerability scan
      function runScan() {
        document.getElementById('vuln').textContent = 'Scanning for vulnerability metrics...';
        fetch('/vulnerabilities')
          .then(response => response.json())
          .then(data => {
            document.getElementById('vuln').textContent =
              'Total CVEs: ' + data.total +
              ', Critical: ' + data.critical +
              ', High: ' + data.high;
          })
          .catch(err => {
            console.error(err);
            document.getElementById('vuln').textContent = 'Error scanning vulnerabilities';
          });
      }

      // Add click event to the scan button
      document.getElementById('scanButton').addEventListener('click', runScan);
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// Vulnerability endpoint: scan the base image "node:23.10.0" using Grype with jq for metrics.
app.get('/vulnerabilities', (req, res) => {
  const command = `grype cgr.dev/chainguard/node:latest --output json | jq '{total: (.matches | length), critical: (.matches | map(select(.vulnerability.severity=="Critical")) | length), high: (.matches | map(select(.vulnerability.severity=="High")) | length)}'`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Grype error:', stderr);
      return res.status(500).json({ error: stderr || 'Unknown grype error' });
    }
    const trimmedOutput = stdout.trim();
    if (!trimmedOutput) {
      console.error("Empty output from grype command");
      return res.status(500).json({ error: 'Empty grype output' });
    }
    try {
      const result = JSON.parse(trimmedOutput);
      res.json(result);
    } catch (e) {
      console.error('Parsing error:', e);
      res.status(500).json({ error: 'Failed to parse grype output' });
    }
  });
});

app.listen(port, () => {
  console.log("App listening on port " + port);
});
