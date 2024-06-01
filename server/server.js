const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 4000;

app.use(cors());

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
