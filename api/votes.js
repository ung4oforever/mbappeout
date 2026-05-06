const fs = require('fs');
const path = require('path');

// En Vercel usamos /tmp para archivos temporales (es el único directorio escribible)
const DATA_FILE = path.join('/tmp', 'votes.json');

function readVotes() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify({ count: 0 }), 'utf-8');
            return { count: 0 };
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        return { count: 0 };
    }
}

function writeVotes(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf-8');
    } catch (err) {
        console.error('Error guardando:', err);
    }
}

module.exports = (req, res) => {
    // Configurar CORS manualmente
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        const data = readVotes();
        return res.json({ count: data.count });
    }

    if (req.method === 'POST') {
        const data = readVotes();
        data.count += 1;
        writeVotes(data);
        return res.json({ count: data.count });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
