// Dart Game functionality
function initDartGame(theme) {
    const dartBoard = document.getElementById('dart-board');
    const dartQuestion = document.getElementById('dart-question');
    const dartOptions = document.getElementById('dart-options');
    const dartScore = document.getElementById('dart-score');
    const dartCrosshair = document.getElementById('dart-crosshair');
    const dartRestart = document.getElementById('dart-restart');
    const dartThrowButton = document.getElementById('dart-throw');
    const dartAimX = document.getElementById('dart-aim-x');
    const dartAimY = document.getElementById('dart-aim-y');
    
    // Game state
    let score = 0;
    let currentQuestion = null;
    let xPosition = 0;
    let yPosition = 0;
    let xMoving = true;
    let xDirection = 1;
    let xSpeed = 2;
    let canThrow = false;
    let animationId = null;
    
    // Initialize game
    startGame();
    
    function startGame() {
        score = 0;
        dartScore.textContent = score;
        canThrow = false;
        
        // Reset crosshair position
        xPosition = 0;
        yPosition = 0;
        updateCrosshairPosition();
        
        // Start with X-axis movement
        startXAiming();
    }
    
    function startXAiming() {
        xMoving = true;
        canThrow = false;
        dartAimX.style.display = 'block';
        dartAimY.style.display = 'none';
        dartThrowButton.style.display = 'none';
        
        showQuestion('x');
        startXAnimation();
    }
    
    function startXAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        function animate() {
            xPosition += xDirection * xSpeed;
            
            // Reverse direction at edges
            if (xPosition >= 100 || xPosition <= 0) {
                xDirection *= -1;
            }
            
            updateCrosshairPosition();
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    function startYAiming() {
        xMoving = false;
        canThrow = true;
        dartAimX.style.display = 'none';
        dartAimY.style.display = 'block';
        dartThrowButton.style.display = 'block';
        
        showQuestion('y');
        startYAnimation();
    }
    
    function startYAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        let yDirection = 1;
        let ySpeed = 1.5;
        let yPositionTemp = 0;
        
        function animate() {
            yPositionTemp += yDirection * ySpeed;
            
            // Reverse direction at edges
            if (yPositionTemp >= 100 || yPositionTemp <= 0) {
                yDirection *= -1;
            }
            
            dartAimY.style.top = yPositionTemp + '%';
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    function handleAnswer(isCorrect, axis) {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        if (!isCorrect) {
            // Add random offset for wrong answer
            const randomOffset = Math.random() * 80 + 20; // 20-100 pixels
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            if (axis === 'x') {
                xPosition = Math.max(0, Math.min(100, xPosition + (direction * randomOffset / 4)));
            } else {
                yPosition = Math.max(0, Math.min(100, yPosition + (direction * randomOffset / 4)));
            }
            updateCrosshairPosition();
        }
        
        if (axis === 'x') {
            setTimeout(() => {
                startYAiming();
            }, 1000);
        } else {
            canThrow = true;
            dartThrowButton.style.display = 'block';
        }
    }
    
    function throwDart() {
        if (!canThrow) return;
        
        canThrow = false;
        dartThrowButton.style.display = 'none';
        
        // Calculate final Y position from the moving aim
        const finalY = parseFloat(dartAimY.style.top);
        yPosition = finalY;
        
        // Calculate score based on distance from center (50,50)
        const distanceFromCenter = Math.sqrt(
            Math.pow(xPosition - 50, 2) + Math.pow(yPosition - 50, 2)
        );
        
        let points = 0;
        if (distanceFromCenter <= 10) points = 10;
        else if (distanceFromCenter <= 20) points = 9;
        else if (distanceFromCenter <= 30) points = 8;
        else if (distanceFromCenter <= 40) points = 7;
        else if (distanceFromCenter <= 50) points = 6;
        else if (distanceFromCenter <= 60) points = 5;
        else if (distanceFromCenter <= 70) points = 4;
        else if (distanceFromCenter <= 80) points = 3;
        else if (distanceFromCenter <= 90) points = 2;
        else if (distanceFromCenter <= 100) points = 1;
        
        score += points;
        dartScore.textContent = score;
        
        // Show dart hit
        const dartHit = document.createElement('div');
        dartHit.className = 'dart-hit';
        dartHit.style.left = xPosition + '%';
        dartHit.style.top = yPosition + '%';
        dartBoard.appendChild(dartHit);
        
        // Show points popup
        const pointsPopup = document.createElement('div');
        pointsPopup.className = 'points-popup';
        pointsPopup.textContent = `+${points}`;
        pointsPopup.style.left = xPosition + '%';
        pointsPopup.style.top = (yPosition - 10) + '%';
        dartBoard.appendChild(pointsPopup);
        
        setTimeout(() => {
            pointsPopup.remove();
        }, 1000);
        
        // Next round after delay
        setTimeout(() => {
            dartHit.remove();
            startGame();
        }, 2000);
    }
    
    function updateCrosshairPosition() {
        dartCrosshair.style.left = xPosition + '%';
        dartCrosshair.style.top = '50%';
    }
    
    function showQuestion(axis) {
        const question = getDartQuestion(theme);
        currentQuestion = question;
        
        dartQuestion.textContent = question.question;
        
        // Clear options
        dartOptions.innerHTML = '';
        
        // Shuffle options randomly
        const shuffledOptions = shuffleArray([...question.options]);
        
        // Create option elements
        shuffledOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'dart-option';
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => {
                if (!xMoving && axis === 'y' && !canThrow) return;
                
                const isCorrect = option === question.answer;
                handleAnswer(isCorrect, axis);
                
                // Visual feedback
                if (isCorrect) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                    // Highlight correct answer
                    document.querySelectorAll('.dart-option').forEach(opt => {
                        if (opt.textContent === question.answer) {
                            opt.classList.add('correct');
                        }
                    });
                }
                
                // Disable further clicks
                document.querySelectorAll('.dart-option').forEach(opt => {
                    opt.style.pointerEvents = 'none';
                });
            });
            
            dartOptions.appendChild(optionElement);
        });
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Event listeners
    dartThrowButton.addEventListener('click', throwDart);
    dartRestart.addEventListener('click', startGame);
}

function getDartQuestion(theme) {
    const questions = {
        nettverk: [
            {
                question: "Hvilken port bruker HTTPS?",
                options: ["443", "80", "21", "25"],
                answer: "443"
            },
            {
                question: "Hva står DNS for?",
                options: [
                    "Domain Name System",
                    "Digital Network Service", 
                    "Data Name Server",
                    "Domain Network System"
                ],
                answer: "Domain Name System"
            }
        ],
        sikkerhet: [
            {
                question: "Hva er hovedformålet med en firewall?",
                options: [
                    "Kontrollere nettverkstrafikk",
                    "Kryptere data",
                    "Skanne for virus",
                    "Lagre passord"
                ],
                answer: "Kontrollere nettverkstrafikk"
            }
        ],
        programmering: [
            {
                question: "Hva er 1101 i binært til desimal?",
                options: ["13", "11", "15", "9"],
                answer: "13"
            }
        ],
        maskinvare: [
            {
                question: "Hvilken logisk port gir output 1 når input er ulike?",
                options: ["XOR", "AND", "OR", "NAND"],
                answer: "XOR"
            }
        ]
    };
    
    const themeQuestions = questions[theme] || questions.nettverk;
    return themeQuestions[Math.floor(Math.random() * themeQuestions.length)];
}