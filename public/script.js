const plantCropButton = document.getElementById('plantCrop');
const farmersCountDisplay = document.getElementById('farmersCount');
const coinsDisplay = document.getElementById('coins');
const autoHarvestButton = document.getElementById('toggleAutoHarvest');
const autoHarvestStatusDisplay = document.getElementById('autoHarvestStatus');
const cropsDisplay = document.getElementById('crops');

let autoHarvesting = false;

plantCropButton.addEventListener('click', async () => {
    const cropType = Math.random() < 0.5 ? 'common' : Math.random() < 0.8 ? 'uncommon' : 'rare';
    const cropElement = document.createElement('div');
    cropElement.className = `crop ${cropType}`;
    cropElement.style.left = `${Math.random() * 100}%`;
    cropElement.style.top = `${Math.random() * 100}%`;
    cropsDisplay.appendChild(cropElement);
    await updateGameState();
});

autoHarvestButton.addEventListener('click', () => {
    autoHarvesting = !autoHarvesting;
    autoHarvestStatusDisplay.textContent = autoHarvesting ? 'On' : 'Off';
    if (autoHarvesting) {
        setInterval(async () => {
            await updateGameState();
        }, 5000); // Auto harvest every 5 seconds
    }
});

async function updateGameState() {
    const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coins: Math.floor(Math.random() * 100), // Simulate coin generation
            crops: Array.from(cropsDisplay.children).map(crop => crop.className.split(' ')[1])
        })
    });
    const gameState = await response.json();
    farmersCountDisplay.textContent = gameState.farmersCount;
    coinsDisplay.textContent = gameState.coins;
}

// Initial fetch to get game state
async function fetchGameState() {
    const response = await fetch('/api/game');
    const gameState = await response.json();
    farmersCountDisplay.textContent = gameState.farmersCount;
    coinsDisplay.textContent = gameState.coins;
}

fetchGameState();