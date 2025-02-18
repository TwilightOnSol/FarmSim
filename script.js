const plantCropButton = document.getElementById('plantCrop');
const farmersCountDisplay = document.getElementById('farmersCount');
const coinsDisplay = document.getElementById('coins');
const autoHarvestButton = document.getElementById('toggleAutoHarvest');
const autoHarvestStatusDisplay = document.getElementById('autoHarvestStatus');
const cropsContainer = document.getElementById('crops');

let autoHarvesting = false;

// Fetch game state from the server
async function fetchGameState() {
    const response = await fetch('/game-state');
    const gameState = await response.json();
    updateUI(gameState);
}

// Update the UI with the game state
function updateUI(gameState) {
    farmersCountDisplay.textContent = gameState.farmersCount;
    coinsDisplay.textContent = gameState.coins;
    cropsContainer.innerHTML = ''; // Clear existing crops
    gameState.crops.forEach(crop => {
        const cropElement = document.createElement('div');
        cropElement.className = `crop ${crop.rarity}`;
        cropElement.style.left = `${crop.x}px`;
        cropElement.style.top = `${crop.y}px`;
        cropsContainer.appendChild(cropElement);
    });
}

// Plant a crop
plantCropButton.addEventListener('click', async () => {
    const crop = {
        rarity: Math.random() < 0.1 ? 'rare' : Math.random() < 0.5 ? 'uncommon' : 'common',
        x: Math.random() * 100, // Random x position
        y: Math.random() * 100  // Random y position
    };
    const response = await fetch('/game-state', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coins: Math.floor(Math.random() * 100), // Random coins for demo
            crops: [...cropsContainer.children].map(crop => ({
                rarity: crop.className.split(' ')[1],
                x: crop.style.left,
                y: crop.style.top
            })).concat(crop) // Add new crop
        })
    });
    await fetchGameState();
});

// Toggle auto harvesting
autoHarvestButton.addEventListener('click', () => {
    autoHarvesting = !autoHarvesting;
    autoHarvestStatusDisplay.textContent = autoHarvesting ? 'On' : 'Off';
    if (autoHarvesting) {
        setInterval(async () => {
            const response = await fetch('/game-state');
            const gameState = await response.json();
            const newCoins = gameState.coins + 10; // Add coins every interval
            await fetch('/game-state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    coins: newCoins,
                    crops: gameState.crops
                })
            });
            await fetchGameState();
        }, 5000); // Harvest every 5 seconds
    }
});

// Initial fetch of game state
fetchGameState();
