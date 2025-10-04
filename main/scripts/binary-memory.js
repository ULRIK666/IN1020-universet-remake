// Binær Memory spill - KOMPLETT FIKSET VERSJON
function initBinaryMemoryGame() {
    const binaryDisplay = document.getElementById('binary-display');
    const binaryInput = document.getElementById('binary-input');
    const binaryNext = document.getElementById('binary-next');
    const binarySequence = document.getElementById('binary-sequence');
    const binaryLevel = document.getElementById('binary-level');
    const binarySequenceLength = document.getElementById('binary-sequence-length');
    const binaryRestart = document.getElementById('binary-restart');
    
    // Game state
    let level = 1;
    let lives = 3;
    let currentBinary = '';
    let gameState = 'showing';
    let displayTime = 4000;
    let sequenceHistory = [];
    
    // Initialize game
    startGame();
    
    function startGame() {
        level = 1;
        lives = 3;
        displayTime = 4000;
        gameState = 'showing';
        currentBinary = '';
        sequenceHistory = [];
        
        // Update UI
        updateLevelDisplay();
        binarySequence.textContent = '';
        binarySequence.style.color = 'white';
        binaryInput.value = '';
        binaryInput.disabled = true;
        binaryInput.placeholder = 'Venter på tall...';
        binaryNext.disabled = true;
        
        // Oppdater liv display
        updateLivesDisplay();
        
        // Start first level
        generateBinary();
        showBinary();
    }
    
    function generateBinary() {
        const binaryLength = level + 3;
        let binary = '';
        
        for (let i = 0; i < binaryLength; i++) {
            binary += Math.random() > 0.5 ? '1' : '0';
        }
        
        currentBinary = binary;
        sequenceHistory.push(currentBinary);
    }
    
    function showBinary() {
        console.log('Showing binary:', currentBinary);
        binaryDisplay.textContent = currentBinary;
        binaryDisplay.style.fontSize = '2.5rem';
        binaryDisplay.style.fontFamily = 'monospace';
        binaryDisplay.style.letterSpacing = '3px';
        binaryDisplay.style.color = '#2ecc71';
        binarySequenceLength.textContent = `Nivå ${level} - ${currentBinary.length} bits`;
        binaryInput.disabled = true;
        binaryNext.disabled = true;
        binaryInput.placeholder = 'Venter på tall...';
        
        // Oppdater sekvensvisning
        updateSequenceDisplay();
        
        setTimeout(() => {
            binaryDisplay.textContent = '???';
            binaryDisplay.style.color = '#ff6b6b';
            gameState = 'input';
            binaryInput.disabled = false;
            binaryNext.disabled = false;
            binaryInput.placeholder = 'Skriv binært tall her';
            binaryInput.focus();
            console.log('Now accepting input');
        }, displayTime);
    }
    
    function updateSequenceDisplay() {
        binarySequence.innerHTML = '';
        sequenceHistory.forEach((binary, index) => {
            const seqItem = document.createElement('div');
            seqItem.style.margin = '5px 0';
            seqItem.style.padding = '8px';
            seqItem.style.backgroundColor = index === sequenceHistory.length - 1 ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            seqItem.style.borderRadius = '5px';
            seqItem.style.border = index === sequenceHistory.length - 1 ? '2px solid #2ecc71' : '1px solid rgba(255, 255, 255, 0.2)';
            seqItem.textContent = `Nivå ${index + 1}: ${binary}`;
            seqItem.style.fontFamily = 'monospace';
            binarySequence.appendChild(seqItem);
        });
    }
    
    function updateLivesDisplay() {
        let livesElement = document.getElementById('binary-lives');
        if (!livesElement) {
            // Finn eller oppdater liv display
            const statsContainer = document.querySelector('#binary-memory-game-area .game-stats');
            if (statsContainer) {
                const existingLifeStat = statsContainer.querySelector('.stat:nth-child(2)');
                if (existingLifeStat) {
                    existingLifeStat.innerHTML = `Liv: <span id="binary-lives">${lives}</span>`;
                } else {
                    const lifeStat = document.createElement('div');
                    lifeStat.className = 'stat';
                    lifeStat.innerHTML = `Liv: <span id="binary-lives">${lives}</span>`;
                    statsContainer.appendChild(lifeStat);
                }
            }
        } else {
            livesElement.textContent = lives;
        }
    }
    
    function handleNext() {
        if (gameState !== 'input') {
            console.log('Game state not input:', gameState);
            return;
        }
        
        const userInput = binaryInput.value.trim();
        console.log('User input:', userInput);
        
        if (userInput === '') {
            showMessage('Skriv inn et binært tall!', 'failure');
            return;
        }
        
        // Valider input - kun 0 og 1 tillatt
        if (!/^[01]+$/.test(userInput)) {
            showMessage('Kun 0 og 1 er tillatt!', 'failure');
            return;
        }
        
        if (userInput === currentBinary) {
            // Riktig svar
            level++;
            displayTime = Math.max(2000, displayTime - 200);
            showMessage(`Riktig! Går til nivå ${level}`, 'success');
            
            setTimeout(() => {
                binaryInput.value = '';
                gameState = 'showing';
                generateBinary();
                showBinary();
            }, 1500);
        } else {
            // Feil svar
            lives--;
            showMessage(`Feil! Riktig svar var: ${currentBinary}`, 'failure');
            updateLivesDisplay();
            
            if (lives <= 0) {
                setTimeout(() => {
                    gameOver();
                }, 2000);
            } else {
                setTimeout(() => {
                    binaryInput.value = '';
                    gameState = 'showing';
                    generateBinary();
                    showBinary();
                }, 2000);
            }
        }
        
        updateLevelDisplay();
    }
    
    function updateLevelDisplay() {
        binaryLevel.textContent = level;
        binarySequenceLength.textContent = `Nivå ${level} - ${currentBinary ? currentBinary.length : 0} bits`;
    }
    
    function gameOver() {
        gameState = 'gameover';
        binaryDisplay.textContent = 'Game Over!';
        binaryDisplay.style.color = '#e74c3c';
        binaryInput.disabled = true;
        binaryNext.disabled = true;
        binaryInput.placeholder = 'Spillet er over';
        showMessage(`Du klarte nivå ${level}! Trykk restart for å spille igjen`, 'failure');
    }
    
    function showMessage(message, type) {
        // Fjern gamle meldinger
        const oldMessages = document.querySelectorAll('#binary-memory-game-area .concept-message');
        oldMessages.forEach(msg => msg.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = `concept-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.marginTop = '20px';
        messageElement.style.padding = '15px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.fontSize = '1.1rem';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(46, 204, 113, 0.3)';
            messageElement.style.color = '#2ecc71';
            messageElement.style.border = '2px solid #2ecc71';
        } else {
            messageElement.style.backgroundColor = 'rgba(231, 76, 60, 0.3)';
            messageElement.style.color = '#e74c3c';
            messageElement.style.border = '2px solid #e74c3c';
        }
        
        document.querySelector('#binary-memory-game-area').appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 3000);
    }
    
    // Event listeners - SIKRE AT DISSE FUNGERER
    binaryNext.addEventListener('click', handleNext);
    
    binaryInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && gameState === 'input') {
            handleNext();
        }
    });
    
    // Input validering - kun 0 og 1
    binaryInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^01]/g, '');
    });
    
    // Restart button
    binaryRestart.addEventListener('click', startGame);
    
    console.log('Binary Memory Game initialized successfully');
}