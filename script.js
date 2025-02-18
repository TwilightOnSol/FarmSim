let coins = 0;
let crops = [];
let farmersCount = 0;
let autoHarvesting = false;

// DOM Elements
const coinsDisplay = document.getElementById('coins');
const cropsDisplay = document.getElementById('crops');
const farmersCountDisplay = document.getElementById('farmersCount');
const plantCropButton = document.getElementById('plantCrop');
const autoHarvestStatusDisplay = document.getElementById('autoHarvestStatus');
const toggleAutoHarvestButton = document.getElementById('toggleAutoHarvest');

// Load game state from server
async function loadGameState() {
    const response = await fetch('http://localhost:3000/game-state');
    const savedGame = await response.json();
    coins = savedGame.coins;
    crops = savedGame.crops;
    farmersCount = savedGame.farmersCount;
    updateDisplay();
}

// Update display function
function updateDisplay() {
    coinsDisplay.innerText = coins;
    farmersCountDisplay.innerText = farmersCount;
    renderCrops();
}

// Render crops function
function renderCrops() {
    cropsDisplay.innerHTML = '';
    crops.forEach(crop => {
        const cropElement = document.createElement('div');
        cropElement.className = `crop ${crop.rarity}`;
        cropElement.style.left = `${crop.x}px`;
        cropElement.style.top = `${crop.y}px`;
        cropsDisplay.appendChild(cropElement);
    });
}

// Function to plant a crop
async function plantCrop() {
    const rarities = ['common', 'uncommon', 'rare'];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    const newCrop = {
        rarity: randomRarity,
        x: Math.random() * (cropsDisplay.clientWidth - 30),
        y: Math.random() * (cropsDisplay.clientHeight - 30)
    };
    crops.push(newCrop);
    coins += randomRarity === 'common' ? 10 : randomRarity === 'uncommon' ? 20 : 50;
    await saveGameState();
    updateDisplay();
}

// Function to save game state to server
async function saveGameState() {
    await fetch('http://localhost:3000/game-state', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coins, crops })
    });
}

// Event listeners
plantCropButton.addEventListener('click', plantCrop);
toggleAutoHarvestButton.addEventListener('click', () => {
    autoHarvesting = !autoHarvesting;
    autoHarvestStatusDisplay.innerText = autoHarvesting ? 'On' : 'Off';
});

// Load initial game state
loadGameState();