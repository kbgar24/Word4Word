const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const DIST_DIR   = path.join(__dirname, "dist");
const port = process.env.PORT || 8000;
const app = express();

app.use(express.static(DIST_DIR));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
