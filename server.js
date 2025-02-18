// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let gameState = {
    coins: 0,
    crops: [],
    farmersCount: 0
};

// Get game state
app.get('/game-state', (req, res) => {
    res.json(gameState);
});

// Update game state
app.post('/game-state', (req, res) => {
    const { coins, crops } = req.body;
    gameState.coins = coins;
    gameState.crops = crops;
    gameState.farmersCount++; // Increment farmers count on each update
    res.json(gameState);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});