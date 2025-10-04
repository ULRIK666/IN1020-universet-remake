// Tug of War Game functionality
function initTugOfWarGame(theme) {
    const tugRope = document.getElementById('tug-rope');
    const tugQuestion = document.getElementById('tug-question');
    const tugOptions = document.getElementById('tug-options');
    const tugPlayer1Score = document.getElementById('tug-player1-score');
    const tugPlayer2Score = document.getElementById('tug-player2-score');
    const tugRopePosition = document.getElementById('tug-rope-position');
    const tugRestart = document.getElementById('tug-restart');
    const tugPlayer1 = document.getElementById('tug-player1');
    const tugPlayer2 = document.getElementById('tug-player2');
    
    // Game state
    let player1Score = 0;
    let player2Score = 0;
    let ropePosition = 50; // 0-100, where 50 is center
    let currentPlayer = 1;
    let gameActive = true;
    
    // Initialize game
    startGame();
    
    function startGame() {
        player1Score = 0;
        player2Score = 0;
        ropePosition = 50;
        gameActive = true;
        currentPlayer = 1;
        
        tugPlayer1Score.textContent = player1Score;
        tugPlayer2Score.textContent = player2Score;
        updateRopePosition();
        updatePlayerTurn();
        
        showQuestion();
    }
    
    function showQuestion() {
        if (!gameActive) return;
        
        const question = getTugOfWarQuestion(theme);
        
        tugQuestion.textContent = question.question;
        
        // Clear options
        tugOptions.innerHTML = '';
        
        // Shuffle options randomly
        const shuffledOptions = shuffleArray([...question.options]);
        
        // Create option elements
        shuffledOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'tug-option';
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => {
                if (!gameActive) return;
                
                const isCorrect = option === question.answer;
                handleAnswer(isCorrect);
                
                // Visual feedback
                if (isCorrect) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                    // Highlight correct answer
                    document.querySelectorAll('.tug-option').forEach(opt => {
                        if (opt.textContent === question.answer) {
                            opt.classList.add('correct');
                        }
                    });
                }
                
                // Disable further clicks
                document.querySelectorAll('.tug-option').forEach(opt => {
                    opt.style.pointerEvents = 'none';
                });
            });
            
            tugOptions.appendChild(optionElement);
        });
    }
    
    function handleAnswer(isCorrect) {
        if (isCorrect) {
            if (currentPlayer === 1) {
                player1Score++;
                tugPlayer1Score.textContent = player1Score;
                ropePosition += 10; // Move rope towards player 1
            } else {
                player2Score++;
                tugPlayer2Score.textContent = player2Score;
                ropePosition -= 10; // Move rope towards player 2
            }
        }
        
        updateRopePosition();
        
        // Check for winner
        if (player1Score >= player2Score + 5) {
            endGame('Spiller 1');
        } else if (player2Score >= player1Score + 5) {
            endGame('Spiller 2');
        } else {
            // Switch player and continue
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updatePlayerTurn();
            
            setTimeout(() => {
                showQuestion();
            }, 2000);
        }
    }
    
    function updateRopePosition() {
        ropePosition = Math.max(0, Math.min(100, ropePosition));
        tugRopePosition.style.left = ropePosition + '%';
        
        // Add pulling animation
        tugRopePosition.style.transform = `translateX(-50%) scaleX(${1 + Math.abs(ropePosition - 50) / 100})`;
    }
    
    function updatePlayerTurn() {
        if (currentPlayer === 1) {
            tugPlayer1.classList.add('active');
            tugPlayer2.classList.remove('active');
            tugQuestion.textContent = "Spiller 1 - " + tugQuestion.textContent;
        } else {
            tugPlayer1.classList.remove('active');
            tugPlayer2.classList.add('active');
            tugQuestion.textContent = "Spiller 2 - " + tugQuestion.textContent;
        }
    }
    
    function endGame(winner) {
        gameActive = false;
        
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = `${winner} vant spillet!`;
        message.style.backgroundColor = winner === 'Spiller 1' ? 
            'rgba(52, 152, 219, 0.9)' : 'rgba(231, 76, 60, 0.9)';
        
        document.querySelector('#tugofwar-game-area').appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Event listener
    tugRestart.addEventListener('click', startGame);
}

function getTugOfWarQuestion(theme) {
    const questions = {
        nettverk: [
            {
                question: "Hva står TCP for?",
                options: [
                    "Transmission Control Protocol",
                    "Transfer Communication Protocol",
                    "Technical Control Protocol", 
                    "Transmission Connection Protocol"
                ],
                answer: "Transmission Control Protocol"
            },
            {
                question: "Hvilken protokoll bruker UDP?",
                options: [
                    "User Datagram Protocol",
                    "Universal Data Protocol",
                    "Unified Digital Protocol",
                    "User Data Protocol"
                ],
                answer: "User Datagram Protocol"
            }
        ],
        sikkerhet: [
            {
                question: "Hva står CIA for i sikkerhet?",
                options: [
                    "Confidentiality, Integrity, Availability",
                    "Central Intelligence Agency",
                    "Computer Information Access",
                    "Cyber Incident Analysis"
                ],
                answer: "Confidentiality, Integrity, Availability"
            }
        ],
        programmering: [
            {
                question: "Hva er 1010 i binært til desimal?",
                options: ["10", "11", "12", "9"],
                answer: "10"
            }
        ],
        maskinvare: [
            {
                question: "Hva er hovedoppgaven til en ALU?",
                options: [
                    "Utføre matematiske og logiske operasjoner",
                    "Kontrollere minnet",
                    "Håndtere input/output",
                    "Kjøre operativsystemet"
                ],
                answer: "Utføre matematiske og logiske operasjoner"
            }
        ]
    };
    
    const themeQuestions = questions[theme] || questions.nettverk;
    return themeQuestions[Math.floor(Math.random() * themeQuestions.length)];
}