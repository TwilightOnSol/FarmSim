// api/game.js
const express = require('express');
const app = express();

app.use(express.json());

let gameState = {
    coins: 0,
    crops: [],
    farmersCount: 0
};

// Get game state
app.get('/', (req, res) => {
    res.json(gameState);
});

// Update game state
app.post('/', (req, res) => {
    const { coins, crops } = req.body;
    gameState.coins = coins;
    gameState.crops = crops;
    gameState.farmersCount++; // Increment farmers count on each update
    res.json(gameState);
});

module.exports = app;