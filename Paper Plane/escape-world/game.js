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

// Puzzle definitions for each clue
const puzzles = {
    // Level 1 puzzles
    '1-1': {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
        answer: ['echo', 'an echo'],
        hint: "Think about sounds bouncing back..."
    },
    '1-2': {
        question: "If you multiply this number by itself, you get 64. What is the number?",
        answer: ['8', 'eight'],
        hint: "Find the square root of 64..."
    },
    '1-3': {
        question: "What comes next in this sequence? 2, 4, 8, 16, ?",
        answer: ['32', 'thirty-two'],
        hint: "Each number is doubled..."
    },
    '1-4': {
        question: "I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?",
        answer: ['pencil', 'a pencil'],
        hint: "Graphite from a mine, in wood..."
    },
    
    // Level 2 puzzles
    '2-1': {
        question: "A man has 53 socks in his drawer: 21 identical blue, 15 identical black, and 17 identical red. The lights are off and he is completely in the dark. How many socks must he take out to be 100% certain he has at least one pair of black socks?",
        answer: ['40', 'forty'],
        hint: "He needs to take out all blue and red socks, then one more..."
    },
    '2-2': {
        question: "What word becomes shorter when you add two letters to it?",
        answer: ['short', 'shorty'],
        hint: "Add 'er' to make it shorter..."
    },
    '2-3': {
        question: "If a clock shows 3:15, what is the angle between the hour and minute hands?",
        answer: ['7.5', '7.5 degrees', '7.5°'],
        hint: "The hour hand moves 0.5 degrees per minute..."
    },
    '2-4': {
        question: "I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?",
        answer: ['fire', 'flame'],
        hint: "It consumes fuel and burns..."
    },
    '2-5': {
        question: "What number comes next? 1, 1, 2, 3, 5, 8, ?",
        answer: ['13', 'thirteen'],
        hint: "Fibonacci sequence: add the two previous numbers..."
    },
    
    // Level 3 puzzles
    '3-1': {
        question: "A chemist has one solution that is 30% acid and another that is 50% acid. How much of each should be mixed to get 100ml of a 40% acid solution?",
        answer: ['50', '50ml'],
        hint: "Equal amounts of each solution..."
    },
    '3-2': {
        question: "If you rearrange the letters 'CIRCUMSTANCES', what new word can you make?",
        answer: ['circumstance', 'circumstances'],
        hint: "Try rearranging 'ACCIRMCSUETN'..."
    },
    '3-3': {
        question: "What is the next number? 1, 4, 9, 16, 25, ?",
        answer: ['36', 'thirty-six'],
        hint: "These are perfect squares..."
    },
    '3-4': {
        question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answer: ['map', 'a map'],
        hint: "Used for navigation..."
    },
    '3-5': {
        question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        answer: ['5', '5 minutes', 'five'],
        hint: "Each machine makes one widget in 5 minutes..."
    },
    '3-6': {
        question: "What word starts with 'E' and ends with 'E', but only has one letter?",
        answer: ['envelope', 'an envelope'],
        hint: "Think about mail..."
    },
    
    // Level 4 puzzles
    '4-1': {
        question: "A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?",
        answer: ['5', '5 cents', '$0.05', '0.05'],
        hint: "If the ball costs 5 cents, the bat costs $1.05..."
    },
    '4-2': {
        question: "I am the beginning of the end, the end of time and space. I am essential to creation, and I surround every place. What am I?",
        answer: ['e', 'the letter e'],
        hint: "Think about the word 'end'..."
    },
    '4-3': {
        question: "What number should replace the question mark? 1, 4, 9, ?, 25, 36",
        answer: ['16', 'sixteen'],
        hint: "Perfect squares..."
    },
    '4-4': {
        question: "Forward I am heavy, backward I am not. What am I?",
        answer: ['ton', 'a ton'],
        hint: "Read it backwards..."
    },
    '4-5': {
        question: "How many times can you subtract 5 from 25?",
        answer: ['1', 'once', 'one'],
        hint: "After the first subtraction, it's no longer 25..."
    },
    '4-6': {
        question: "I am an odd number. Take away a letter and I become even. What number am I?",
        answer: ['7', 'seven'],
        hint: "Take away 's' from 'seven'..."
    },
    '4-7': {
        question: "What comes next? A, E, I, O, ?",
        answer: ['u', 'U'],
        hint: "Vowels in order..."
    },
    
    // Level 5 puzzles
    '5-1': {
        question: "I have keys but no locks. I have space but no room. You can enter, but you can't go inside. What am I?",
        answer: ['keyboard', 'a keyboard'],
        hint: "Used for typing..."
    },
    '5-2': {
        question: "The more you take, the more you leave behind. What are they?",
        answer: ['footsteps', 'steps'],
        hint: "Something you leave when walking..."
    },
    '5-3': {
        question: "What number is half of a quarter of a tenth of 400?",
        answer: ['5', 'five'],
        hint: "400 ÷ 10 = 40, ÷ 4 = 10, ÷ 2 = 5..."
    },
    '5-4': {
        question: "I am tall when I'm young, and short when I'm old. What am I?",
        answer: ['candle', 'a candle'],
        hint: "Burns down over time..."
    },
    '5-5': {
        question: "What is the smallest positive integer that is divisible by both 8 and 12?",
        answer: ['24', 'twenty-four'],
        hint: "Find the LCM of 8 and 12..."
    },
    '5-6': {
        question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
        answer: ['fire', 'flame'],
        hint: "It grows and needs oxygen..."
    },
    '5-7': {
        question: "What three letters can be placed in front of the letters EAR to make a new word?",
        answer: ['tea', 'TEA'],
        hint: "Tea + ear = ..."
    },
    '5-8': {
        question: "If you have it, you want to share it. If you share it, you don't have it. What is it?",
        answer: ['secret', 'a secret'],
        hint: "Something you keep to yourself..."
    }
};

// Game state
const gameState = {
    currentLevel: 0,
    cluesFound: [],
    exitUnlocked: false,
    currentPuzzle: null
};

// Performance optimizations
let rafId = null;

// Cache DOM elements
let overlay = null;
let room = null;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    overlay = document.getElementById('flashlight-overlay');
    room = document.getElementById('room');
    
    // Update window dimensions
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    startLevel(0);
    initFlashlight();
    setupResizeHandler();
});

// Setup resize handler
function setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        }, 100);
    }, { passive: true });
}

// Optimized flashlight - use requestAnimationFrame for smooth updates
function initFlashlight() {
    let rafId = null;
    let isAnimating = false;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    
    function updateFlashlight() {
        if (!isAnimating) return;
        
        // Smooth interpolation
        const lerp = 0.2;
        currentX += (targetX - currentX) * lerp;
        currentY += (targetY - currentY) * lerp;
        
        // Update CSS custom property
        overlay.style.setProperty('--mouse-x', `${currentX}%`);
        overlay.style.setProperty('--mouse-y', `${currentY}%`);
        
        // Continue animation if still needed
        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
            rafId = requestAnimationFrame(updateFlashlight);
        } else {
            isAnimating = false;
            rafId = null;
        }
    }
    
    function handleMove(clientX, clientY) {
        targetX = (clientX / windowWidth) * 100;
        targetY = (clientY / windowHeight) * 100;
        
        if (!isAnimating) {
            isAnimating = true;
            rafId = requestAnimationFrame(updateFlashlight);
        }
    }
    
    // Use passive listeners
    room.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
    }, { passive: true });
    
    room.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    }, { passive: false });
    
    // Initial position
    overlay.style.setProperty('--mouse-x', '50%');
    overlay.style.setProperty('--mouse-y', '50%');
    currentX = 50;
    currentY = 50;
    targetX = 50;
    targetY = 50;
}

// Start a level
function startLevel(levelIndex) {
    gameState.currentLevel = levelIndex;
    gameState.cluesFound = [];
    gameState.exitUnlocked = false;
    
    // Cancel any pending animations
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    
    const level = levels[levelIndex];
    
    // Clear previous level
    room.innerHTML = '<div id="flashlight-overlay"></div>';
    overlay = document.getElementById('flashlight-overlay');
    
    // Set background
    room.style.backgroundColor = level.backgroundColor;
    
    // Create clues using document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    level.clues.forEach(clue => {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue';
        clueElement.id = `clue${clue.id}`;
        clueElement.style.top = clue.position.top;
        clueElement.style.left = clue.position.left;
        clueElement.setAttribute('data-clue', clue.id);
        clueElement.innerHTML = `<div class="clue-icon">${clue.icon}</div>`;
        fragment.appendChild(clueElement);
    });
    
    // Create exit door
    const exitDoor = document.createElement('div');
    exitDoor.id = 'exit-door';
    exitDoor.style.top = level.exitPosition.top;
    exitDoor.style.left = level.exitPosition.left;
    exitDoor.className = 'locked';
    exitDoor.innerHTML = '<div class="door-icon">🚪</div>';
    fragment.appendChild(exitDoor);
    
    room.appendChild(fragment);
    
    // Reset flashlight position
    overlay.style.setProperty('--mouse-x', '50%');
    overlay.style.setProperty('--mouse-y', '50%');
    
    // Setup interactions
    initFlashlight();
    setupClues(level);
    setupExit(level);
    updateUI(level);
    
    // Hide transition screen
    const transition = document.getElementById('level-transition');
    transition.classList.add('hidden');
    
    showMessage(`Welcome to ${level.name}! Find all clues to escape.`);
}

// Setup clue interactions
function setupClues(level) {
    const clues = document.querySelectorAll('.clue');
    
    clues.forEach(clue => {
        clue.addEventListener('click', () => {
            const clueId = parseInt(clue.getAttribute('data-clue'));
            const clueData = level.clues.find(c => c.id === clueId);
            
            if (gameState.cluesFound.includes(clueId)) {
                // Already solved, show clue text
                showClueText(clueData.text);
                return;
            }
            
            // Show puzzle for this clue
            const puzzleKey = `${level.level}-${clueId}`;
            const puzzle = puzzles[puzzleKey];
            
            if (puzzle) {
                showPuzzle(puzzle, clueId, clueData);
            } else {
                // Fallback if no puzzle (shouldn't happen)
                unlockClue(clueId, clueData, level);
            }
        }, { passive: true });
    });
}

// Show puzzle modal
function showPuzzle(puzzle, clueId, clueData) {
    const modal = document.getElementById('puzzle-modal');
    const question = document.getElementById('puzzle-question');
    const answerInput = document.getElementById('puzzle-answer');
    const hintContainer = document.getElementById('puzzle-hint-container');
    const feedback = document.getElementById('puzzle-feedback');
    const submitBtn = document.getElementById('puzzle-submit');
    const closeBtn = document.getElementById('puzzle-close');
    
    gameState.currentPuzzle = { puzzle, clueId, clueData };
    
    question.textContent = puzzle.question;
    answerInput.value = '';
    answerInput.focus();
    feedback.textContent = '';
    feedback.className = '';
    hintContainer.classList.add('hidden');
    hintContainer.classList.remove('shown');
    
    modal.classList.remove('hidden');
    
    // Setup submit handler
    const submitHandler = () => {
        checkAnswer(puzzle, answerInput.value.trim().toLowerCase(), clueId, clueData);
    };
    
    answerInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            submitHandler();
        }
    };
    
    submitBtn.onclick = submitHandler;
    closeBtn.onclick = () => {
        modal.classList.add('hidden');
        gameState.currentPuzzle = null;
    };
}

// Check puzzle answer
function checkAnswer(puzzle, userAnswer, clueId, clueData) {
    const feedback = document.getElementById('puzzle-feedback');
    const answerInput = document.getElementById('puzzle-answer');
    const hintContainer = document.getElementById('puzzle-hint-container');
    const level = levels[gameState.currentLevel];
    
    const correctAnswers = puzzle.answer.map(a => a.toLowerCase());
    
    if (correctAnswers.includes(userAnswer)) {
        // Correct answer!
        feedback.textContent = '✓ Correct! Clue unlocked!';
        feedback.className = 'success';
        
        setTimeout(() => {
            document.getElementById('puzzle-modal').classList.add('hidden');
            unlockClue(clueId, clueData, level);
            gameState.currentPuzzle = null;
        }, 1000);
    } else {
        // Wrong answer
        feedback.textContent = '✗ Incorrect. Try again!';
        feedback.className = 'error';
        answerInput.value = '';
        answerInput.focus();
        
        // Show hint after first wrong attempt
        if (!hintContainer.classList.contains('shown')) {
            hintContainer.classList.remove('hidden');
            hintContainer.classList.add('shown');
            document.getElementById('puzzle-hint').textContent = `Hint: ${puzzle.hint}`;
        }
    }
}

// Unlock clue after solving puzzle
function unlockClue(clueId, clueData, level) {
    gameState.cluesFound.push(clueId);
    const clueElement = document.getElementById(`clue${clueId}`);
    if (clueElement) {
        clueElement.classList.add('found');
    }
    
    showMessage(`🔓 Clue ${clueId} unlocked!`);
    showClueText(clueData.text);
    
    updateUI(level);
    checkWinCondition(level);
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
    }, { passive: true });
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

