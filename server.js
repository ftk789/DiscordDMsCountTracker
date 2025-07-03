const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const port = 3644;

const server = http.createServer(app);

process.title = 'Discord DM Count tracker Data Server';

let discordDataStore = [];

app.use(cors());
app.use(express.json());

app.post('/update', (req, res) => {
    console.log('Received data from Discord:', req.body);
    discordDataStore = req.body;
    // You can do your logic here now.
    console.log(discordDataStore)

    res.status(200).send({ message: 'Data updated successfully' });
});

server.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
