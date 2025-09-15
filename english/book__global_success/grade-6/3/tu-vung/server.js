const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Define the directory to serve static files from
const staticDir = __dirname;

app.use(express.static(staticDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Serving files from: ${staticDir}`);
});
