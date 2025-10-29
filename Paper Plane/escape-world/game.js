// Level definitions
const levels = [
    {
        level: 1,
        name: "The Basement",
        clues: [
            { id: 1, position: { top: '20%', left: '15%' }, icon: '🔑', text: "An old key lies forgotten in the corner..." },
            { id: 2, position: { top: '60%', left: '80%' }, icon: '📝', text: "A note: 'The walls have ears, watch carefully'" },
            { id: 3, position: { top: '80%', left: '30%' }, icon: '🔍', text: "Something glimmers beneath the shadows" },
            { id: 4, position: { top: '40%', left: '50%' }, icon: '💡', text: "A spark of light reveals the path forward" }
        ],
        exitPosition: { top: '10%', left: '45%' },
        backgroundColor: '#1a1a1a'
    },
    {
        level: 2,
        name: "The Library",
        clues: [
            { id: 1, position: { top: '15%', left: '75%' }, icon: '📚', text: "A book falls open: 'Knowledge is power'" },
            { id: 2, position: { top: '45%', left: '25%' }, icon: '🔖', text: "A bookmark marks the important page" },
            { id: 3, position: { top: '70%', left: '60%' }, icon: '🕯️', text: "A candle flickers, revealing hidden text" },
            { id: 4, position: { top: '25%', left: '50%' }, icon: '📜', text: "An ancient scroll whispers secrets" },
            { id: 5, position: { top: '85%', left: '10%' }, icon: '🔐', text: "A locked drawer hides something important" }
        ],
        exitPosition: { top: '50%', left: '90%' },
        backgroundColor: '#2a1f0f'
    },
    {
        level: 3,
        name: "The Laboratory",
        clues: [
            { id: 1, position: { top: '30%', left: '20%' }, icon: '🧪', text: "A test tube glows with mysterious liquid" },
            { id: 2, position: { top: '20%', left: '70%' }, icon: '⚗️', text: "Chemical formulas cover the walls" },
            { id: 3, position: { top: '60%', left: '50%' }, icon: '🔬', text: "A microscope reveals tiny inscriptions" },
            { id: 4, position: { top: '75%', left: '15%' }, icon: '⚡', text: "Electrical sparks illuminate hidden symbols" },
            { id: 5, position: { top: '40%', left: '85%' }, icon: '🧬', text: "DNA strands form a pattern" },
            { id: 6, position: { top: '10%', left: '40%' }, icon: '🔋', text: "A battery powers the escape mechanism" }
        ],
        exitPosition: { top: '5%', left: '5%' },
        backgroundColor: '#0f1a2a'
    },
    {
        level: 4,
        name: "The Vault",
        clues: [
            { id: 1, position: { top: '25%', left: '30%' }, icon: '💎', text: "Precious gems reflect the light" },
            { id: 2, position: { top: '50%', left: '70%' }, icon: '🗝️', text: "Multiple keys, but which one fits?" },
            { id: 3, position: { top: '70%', left: '20%' }, icon: '🔢', text: "Numbers dance across the walls" },
            { id: 4, position: { top: '15%', left: '60%' }, icon: '🎯', text: "Precision is key to success" },
            { id: 5, position: { top: '80%', left: '80%' }, icon: '⚙️', text: "Gears turn in a complex pattern" },
            { id: 6, position: { top: '40%', left: '10%' }, icon: '🔓', text: "The final mechanism awaits" },
            { id: 7, position: { top: '55%', left: '50%' }, icon: '🌟', text: "The star pattern reveals all" }
        ],
        exitPosition: { top: '45%', left: '45%' },
        backgroundColor: '#1a0f1a'
    },
    {
        level: 5,
        name: "The Final Escape",
        clues: [
            { id: 1, position: { top: '20%', left: '20%' }, icon: '🎪', text: "The final act begins" },
            { id: 2, position: { top: '30%', left: '70%' }, icon: '🎭', text: "Truth hides behind masks" },
            { id: 3, position: { top: '60%', left: '40%' }, icon: '🎪', text: "The circus awaits your escape" },
            { id: 4, position: { top: '75%', left: '75%' }, icon: '🎈', text: "Freedom floats on the horizon" },
            { id: 5, position: { top: '50%', left: '10%' }, icon: '🎯', text: "One final riddle to solve" },
            { id: 6, position: { top: '10%', left: '50%' }, icon: '🚀', text: "Test flight complete - prepare for launch!" },
            { id: 7, position: { top: '80%', left: '50%' }, icon: '✨', text: "You've mastered the darkness" },
            { id: 8, position: { top: '45%', left: '90%' }, icon: '🏆', text: "Victory is within reach" }
        ],
        exitPosition: { top: '50%', left: '50%' },
        backgroundColor: '#0a0a0a'
    }
];

// Game state
const gameState = {
    currentLevel: 0,
    cluesFound: [],
    exitUnlocked: false
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    startLevel(0);
});

// Start a level
function startLevel(levelIndex) {
    gameState.currentLevel = levelIndex;
    gameState.cluesFound = [];
    gameState.exitUnlocked = false;
    
    const level = levels[levelIndex];
    const room = document.getElementById('room');
    
    // Clear previous level
    room.innerHTML = '<div id="flashlight-overlay"></div>';
    
    // Set background
    room.style.backgroundColor = level.backgroundColor;
    
    // Create clues
    level.clues.forEach(clue => {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue';
        clueElement.id = `clue${clue.id}`;
        clueElement.style.top = clue.position.top;
        clueElement.style.left = clue.position.left;
        clueElement.setAttribute('data-clue', clue.id);
        clueElement.innerHTML = `<div class="clue-icon">${clue.icon}</div>`;
        room.appendChild(clueElement);
    });
    
    // Create exit door
    const exitDoor = document.createElement('div');
    exitDoor.id = 'exit-door';
    exitDoor.style.top = level.exitPosition.top;
    exitDoor.style.left = level.exitPosition.left;
    exitDoor.className = 'locked';
    exitDoor.innerHTML = '<div class="door-icon">🚪</div>';
    room.appendChild(exitDoor);
    
    // Setup interactions
    setupFlashlight();
    setupClues(level);
    setupExit(level);
    updateUI(level);
    
    // Hide transition screen
    const transition = document.getElementById('level-transition');
    transition.classList.add('hidden');
    
    showMessage(`Welcome to ${level.name}! Find all clues to escape.`);
}

// Flashlight follows mouse
function setupFlashlight() {
    const overlay = document.getElementById('flashlight-overlay');
    const room = document.getElementById('room');
    
    const handleMove = (clientX, clientY) => {
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        overlay.style.setProperty('--mouse-x', `${x}%`);
        overlay.style.setProperty('--mouse-y', `${y}%`);
    };
    
    room.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
    });
    
    room.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    });
}

// Setup clue interactions
function setupClues(level) {
    const clues = document.querySelectorAll('.clue');
    
    clues.forEach(clue => {
        clue.addEventListener('click', () => {
            const clueId = parseInt(clue.getAttribute('data-clue'));
            const clueData = level.clues.find(c => c.id === clueId);
            
            if (!gameState.cluesFound.includes(clueId)) {
                gameState.cluesFound.push(clueId);
                clue.classList.add('found');
                
                showMessage(`Found clue ${clueId}!`);
                showClueText(clueData.text);
                
                updateUI(level);
                checkWinCondition(level);
            }
        });
    });
}

// Setup exit door
function setupExit(level) {
    const exitDoor = document.getElementById('exit-door');
    
    exitDoor.addEventListener('click', () => {
        if (gameState.exitUnlocked) {
            showMessage('🎉 Door unlocked!');
            
            setTimeout(() => {
                if (gameState.currentLevel < levels.length - 1) {
                    // Move to next level
                    showLevelTransition(level.name, levels[gameState.currentLevel + 1].name);
                    setTimeout(() => {
                        startLevel(gameState.currentLevel + 1);
                    }, 2000);
                } else {
                    // Game complete!
                    showMessage('🎉🎉🎉 CONGRATULATIONS! You completed all levels! 🎉🎉🎉');
                    setTimeout(() => {
                        if (confirm('🏆 You mastered Test Flight! Play again from the beginning?')) {
                            startLevel(0);
                        }
                    }, 2000);
                }
            }, 1000);
        } else {
            const missing = level.clues.length - gameState.cluesFound.length;
            showMessage(`The door is locked! You need ${missing} more clue${missing !== 1 ? 's' : ''}.`);
        }
    });
}

// Show level transition
function showLevelTransition(completedLevel, nextLevel) {
    const transition = document.getElementById('level-transition');
    const title = document.getElementById('transition-title');
    const text = document.getElementById('transition-text');
    
    title.textContent = 'Level Complete!';
    text.textContent = `Escaped ${completedLevel}! Moving to ${nextLevel}...`;
    
    transition.classList.remove('hidden');
}

// Check if player can exit
function checkWinCondition(level) {
    if (gameState.cluesFound.length === level.clues.length && !gameState.exitUnlocked) {
        gameState.exitUnlocked = true;
        const exitDoor = document.getElementById('exit-door');
        exitDoor.classList.remove('locked');
        exitDoor.classList.add('unlocked');
        showMessage('🔓 The door is now unlocked! Click it to escape!');
    }
}

// Update UI elements
function updateUI(level) {
    const currentLevelEl = document.getElementById('current-level');
    const clueCountEl = document.getElementById('clue-count');
    const totalCluesEl = document.getElementById('total-clues');
    
    currentLevelEl.textContent = level.level;
    clueCountEl.textContent = gameState.cluesFound.length;
    totalCluesEl.textContent = level.clues.length;
}

// Show temporary message
function showMessage(text) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.classList.add('show');
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// Show clue text
function showClueText(text) {
    const clueDisplay = document.getElementById('clue-display');
    clueDisplay.innerHTML = `<div class="clue-text">${text}</div>`;
    clueDisplay.classList.add('show');
}
