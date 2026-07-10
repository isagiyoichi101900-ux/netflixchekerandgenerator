const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cookies Folder
const cookiesFolder = path.join(__dirname, 'cookies');
if (!fs.existsSync(cookiesFolder)) {
    fs.mkdirSync(cookiesFolder, { recursive: true });
}

let serverCookies = [];
function loadCookies() {
    serverCookies = [];
    const files = fs.readdirSync(cookiesFolder).filter(file => file.endsWith('.txt'));
    files.forEach(file => {
        const content = fs.readFileSync(path.join(cookiesFolder, file), 'utf8').trim();
        if (content) serverCookies.push(content);
    });
}
loadCookies();

// Check Cookie
app.post('/api/check', async (req, res) => {
    const { cookie } = req.body;
    if (!cookie) return res.status(400).json({ status: 'ERROR', message: 'No cookie provided' });

    try {
        const response = await axios.post('https://nftoken.site/v1/api.php', {
            key: "NFK_cde619bfa57bd794d0e574da",
            cookie: cookie
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Connection failed' });
    }
});

// Get Server Cookies
app.get('/api/cookies', (req, res) => {
    loadCookies();
    res.json(serverCookies);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});