// Wordle Game functionality
function initWordleGame(theme) {
    const wordleHint = document.getElementById('wordle-hint');
    const wordleBoard = document.getElementById('wordle-board');
    const wordleInput = document.getElementById('wordle-input');
    const wordleSubmit = document.getElementById('wordle-submit');
    const wordleRestart = document.getElementById('wordle-restart');
    const wordleAttempts = document.getElementById('wordle-attempts');
    
    // Get word and hint based on theme
    const { word, hint } = getWordleWord(theme);
    
    let attempts = 0;
    const maxAttempts = 6;
    let gameOver = false;
    
    // Set input max length based on word length
    wordleInput.maxLength = word.length;
    
    // Display hint
    wordleHint.textContent = hint;
    
    // Create board
    createBoard();
    
    // Submit guess
    wordleSubmit.addEventListener('click', processGuess);
    wordleInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') processGuess();
    });
    
    function createBoard() {
        wordleBoard.innerHTML = '';
        for (let i = 0; i < maxAttempts; i++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            
            for (let j = 0; j < word.length; j++) {
                const cell = document.createElement('div');
                cell.className = 'wordle-cell';
                row.appendChild(cell);
            }
            
            wordleBoard.appendChild(row);
        }
    }
    
    function processGuess() {
        if (gameOver) return;
        
        const guess = wordleInput.value.toUpperCase();
        
        // Validate guess
        if (guess.length !== word.length) {
            alert(`Ordet må være ${word.length} bokstaver langt!`);
            return;
        }
        
        // Update attempts
        attempts++;
        wordleAttempts.textContent = attempts;
        
        // Get current row
        const currentRow = wordleBoard.children[attempts - 1];
        const cells = currentRow.children;
        
        // Check each letter
        let correctCount = 0;
        const wordArray = word.split('');
        const guessArray = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < word.length; i++) {
            if (guessArray[i] === wordArray[i]) {
                cells[i].classList.add('correct');
                cells[i].textContent = guessArray[i];
                correctCount++;
                wordArray[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark partial matches
        for (let i = 0; i < word.length; i++) {
            if (cells[i].classList.contains('correct')) continue;
            
            const index = wordArray.indexOf(guessArray[i]);
            if (index !== -1) {
                cells[i].classList.add('partial');
                cells[i].textContent = guessArray[i];
                wordArray[index] = null; // Mark as used
            } else {
                cells[i].classList.add('incorrect');
                cells[i].textContent = guessArray[i];
            }
        }
        
        // Check win condition
        if (correctCount === word.length) {
            gameOver = true;
            wordleHint.textContent = `Gratulerer! Du gjettet ordet "${word}" på ${attempts} forsøk!`;
            wordleSubmit.style.display = 'none';
            wordleRestart.style.display = 'block';
        } else if (attempts >= maxAttempts) {
            gameOver = true;
            wordleHint.textContent = `Beklager! Ordet var "${word}". Prøv igjen!`;
            wordleSubmit.style.display = 'none';
            wordleRestart.style.display = 'block';
        }
        
        // Clear input
        wordleInput.value = '';
    }
    
    // Restart button
    wordleRestart.addEventListener('click', () => {
        initWordleGame(theme);
    });
}

function getWordleWord(theme) {
    const wordSets = {
        nettverk: [
            { word: "ROUTER", hint: "Enhet som sender datapakker mellom datanett" },
            { word: "SERVER", hint: "Datamaskin som tilbyr tjenester til klienter" },
            { word: "SOCKET", hint: "Endepunkt for kommunikasjon mellom maskiner" }
        ],
        sikkerhet: [
            { word: "CIPHER", hint: "Algoritme for kryptering og dekryptering" },
            { word: "ATTACK", hint: "Forsøk på å skade eller få uautorisert tilgang" },
            { word: "BREACH", hint: "Sikkerhetsbrudd der data blir eksponert" }
        ],
        programmering: [
            { word: "BINARY", hint: "Tallsystem med base 2, kun 0 og 1" },
            { word: "MEMORY", hint: "Datamaskinens lagring for data og instruksjoner" },
            { word: "SYNTAX", hint: "Regler for hvordan kode skal skrives" }
        ],
        maskinvare: [
            { word: "CACHE", hint: "Hurtigminne som lagrer ofte brukte data" },
            { word: "DEVICE", hint: "Fysisk komponent i et datasystem" },
            { word: "SOCKET", hint: "Koblingspunkt for prosessor på hovedkort" }
        ]
    };
    
    const themeWords = wordSets[theme] || wordSets.nettverk;
    return themeWords[Math.floor(Math.random() * themeWords.length)];
}