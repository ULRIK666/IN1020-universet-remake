// Tre på Rad spill
function initTicTacToeGame(theme) {
    const tictactoeBoard = document.getElementById('tictactoe-board');
    const tictactoeTurn = document.getElementById('tictactoe-turn');
    const tictactoeQuestion = document.getElementById('tictactoe-question');
    const tictactoeOptions = document.getElementById('tictactoe-options');
    const player1Lives = document.getElementById('player1-lives');
    const player2Lives = document.getElementById('player2-lives');
    const tictactoeRestart = document.getElementById('tictactoe-restart');
    
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let player1Life = 3;
    let player2Life = 3;
    let gameActive = true;
    let currentQuestion = null;
    
    // Initialize game
    startGame();
    
    function startGame() {
        // Reset game state
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        player1Life = 3;
        player2Life = 3;
        gameActive = true;
        
        // Update UI
        updateLives();
        updateTurnDisplay();
        
        // Create board
        createBoard();
        
        // Clear question area
        tictactoeQuestion.textContent = '';
        tictactoeOptions.innerHTML = '';
    }
    
    function createBoard() {
        tictactoeBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'tictactoe-cell';
            cell.setAttribute('data-index', i);
            
            cell.addEventListener('click', () => {
                if (gameActive && board[i] === '' && !currentQuestion) {
                    showQuestion(i);
                }
            });
            
            tictactoeBoard.appendChild(cell);
        }
    }
    
    function showQuestion(cellIndex) {
        currentQuestion = getRandomQuestion(theme);
        tictactoeQuestion.textContent = currentQuestion.question;
        
        // Create options
        tictactoeOptions.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'tictactoe-option';
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => {
                handleAnswer(option === currentQuestion.answer, cellIndex);
            });
            
            tictactoeOptions.appendChild(optionElement);
        });
    }
    
    function handleAnswer(isCorrect, cellIndex) {
        if (isCorrect) {
            // Correct answer - place mark
            board[cellIndex] = currentPlayer;
            document.querySelector(`[data-index="${cellIndex}"]`).textContent = currentPlayer;
            document.querySelector(`[data-index="${cellIndex}"]`).classList.add(currentPlayer.toLowerCase());
            
            // Check for win
            if (checkWin()) {
                gameActive = false;
                showMessage(`Spiller ${currentPlayer === 'X' ? '1' : '2'} vant!`);
                setTimeout(() => {
                    startGame();
                }, 3000);
                return;
            }
            
            // Check for draw
            if (board.every(cell => cell !== '')) {
                gameActive = false;
                showMessage('Uavgjort!');
                setTimeout(() => {
                    startGame();
                }, 3000);
                return;
            }
            
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateTurnDisplay();
        } else {
            // Wrong answer - lose life
            if (currentPlayer === 'X') {
                player1Life--;
            } else {
                player2Life--;
            }
            updateLives();
            
            // Check if player lost all lives
            if ((currentPlayer === 'X' && player1Life <= 0) || 
                (currentPlayer === 'O' && player2Life <= 0)) {
                gameActive = false;
                const winner = currentPlayer === 'X' ? 'Spiller 2' : 'Spiller 1';
                showMessage(`${winner} vant!`);
                setTimeout(() => {
                    startGame();
                }, 3000);
                return;
            }
            
            // Stay with same player for next turn
        }
        
        // Clear question
        currentQuestion = null;
        tictactoeQuestion.textContent = '';
        tictactoeOptions.innerHTML = '';
    }
    
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return board[index] === currentPlayer;
            });
        });
    }
    
    function updateLives() {
        player1Lives.textContent = player1Life;
        player2Lives.textContent = player2Life;
    }
    
    function updateTurnDisplay() {
        tictactoeTurn.textContent = `Spiller ${currentPlayer === 'X' ? '1' : '2'} (${currentPlayer}) sin tur`;
    }
    
    function showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
    
    function getRandomQuestion(theme) {
        const questions = getTicTacToeQuestions(theme);
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    // Restart button
    tictactoeRestart.addEventListener('click', startGame);
}

function getTicTacToeQuestions(theme) {
    // Returner relevante spørsmål for temaet
    // Dette er et utvalg - du kan utvide dette
    return [
        {
            question: "Hva står HTTP for?",
            options: ["Hypertext Transfer Protocol", "High Transfer Text Protocol", "Hyper Transfer Text Protocol", "High Text Transfer Protocol"],
            answer: "Hypertext Transfer Protocol"
        },
        {
            question: "Hvilken port bruker HTTPS?",
            options: ["443", "80", "8080", "21"],
            answer: "443"
        },
        {
            question: "Hva er hovedforskjellen mellom TCP og UDP?",
            options: ["TCP er pålitelig, UDP er ikke", "TCP er raskere", "UDP bruker porter", "TCP er for e-post"],
            answer: "TCP er pålitelig, UDP er ikke"
        }
        // Legg til flere spørsmål her
    ];
}