// Quiz Game functionality - MED TILFELDIGE SVARALTERNATIVER
function initQuizGame(theme) {
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizScore = document.getElementById('quiz-score');
    const quizTime = document.getElementById('quiz-time');
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');
    const finalScore = document.getElementById('final-score');
    const quizPlayAgain = document.getElementById('quiz-play-again');
    
    // Game state
    let score = 0;
    let timeLeft = 30;
    let currentQuestionIndex = 0;
    let timer;
    let gameActive = true;
    
    // Get questions based on theme
    const questions = getQuizQuestions(theme);
    
    // Start the game
    startGame();
    
    function startGame() {
        score = 0;
        timeLeft = 30;
        currentQuestionIndex = 0;
        gameActive = true;
        
        // Show quiz content, hide result
        quizContent.style.display = 'block';
        quizResult.style.display = 'none';
        
        // Update UI
        quizScore.textContent = score;
        quizTime.textContent = timeLeft;
        
        // Start timer
        startTimer();
        
        // Show first question
        showQuestion();
    }
    
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            if (gameActive) {
                timeLeft--;
                quizTime.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endGame();
                }
            }
        }, 1000);
    }
    
    function showQuestion() {
        if (currentQuestionIndex >= questions.length || score >= 1000) {
            endGame();
            return;
        }
        
        const question = questions[currentQuestionIndex];
        quizQuestion.textContent = question.question;
        
        // Clear options
        quizOptions.innerHTML = '';
        
        // Shuffle options randomly
        const shuffledOptions = shuffleArray([...question.options]);
        
        // Create option elements
        shuffledOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => {
                if (!gameActive) return;
                
                // Pause timer while showing result
                gameActive = false;
                
                // Disable all options
                document.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.style.pointerEvents = 'none';
                });
                
                if (option === question.answer) {
                    // Correct answer
                    optionElement.classList.add('correct');
                    score += 10;
                    timeLeft += 10; // Add 10 seconds for correct answer
                    quizScore.textContent = score;
                    quizTime.textContent = timeLeft;
                } else {
                    // Incorrect answer
                    optionElement.classList.add('incorrect');
                    timeLeft -= 5; // Subtract 5 seconds for incorrect answer
                    quizTime.textContent = timeLeft;
                    
                    // Highlight correct answer
                    document.querySelectorAll('.quiz-option').forEach(opt => {
                        if (opt.textContent === question.answer) {
                            opt.classList.add('correct');
                        }
                    });
                }
                
                // Move to next question after delay
                setTimeout(() => {
                    currentQuestionIndex++;
                    gameActive = true;
                    showQuestion();
                }, 2000);
            });
            
            quizOptions.appendChild(optionElement);
        });
        
        currentQuestionIndex++;
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    function endGame() {
        clearInterval(timer);
        gameActive = false;
        
        // Show result screen
        quizContent.style.display = 'none';
        quizResult.style.display = 'block';
        finalScore.textContent = score;
    }
    
    // Play again button
    quizPlayAgain.addEventListener('click', startGame);
}

function getQuizQuestions(theme) {
    const questionSets = {
        nettverk: [
            {
                question: "Hva står TCP for, og hva er hovedforskjellen fra UDP?",
                options: [
                    "Transmission Control Protocol - TCP er pålitelig med feilkontroll, UDP er ikke",
                    "Transfer Communication Protocol - TCP er raskere enn UDP", 
                    "Technical Control Protocol - TCP bruker porter, UDP gjør ikke",
                    "Transmission Connection Protocol - TCP er for trådløse nettverk"
                ],
                answer: "Transmission Control Protocol - TCP er pålitelig med feilkontroll, UDP er ikke"
            },
            {
                question: "Hva er en IP-adresse og hva er forskjellen mellom IPv4 og IPv6?",
                options: [
                    "En unik identifikator for maskiner - IPv4 har 32 bits, IPv6 har 128 bits",
                    "En type MAC-adresse - IPv4 er raskere enn IPv6",
                    "En sikkerhetsnøkkel - IPv4 bruker bokstaver, IPv6 bruker tall",
                    "En protokoll for e-post - IPv4 er for mobil, IPv6 for PC"
                ],
                answer: "En unik identifikator for maskiner - IPv4 har 32 bits, IPv6 har 128 bits"
            },
            {
                question: "Hva er DNS og hvordan fungerer det?",
                options: [
                    "Domain Name System - Oversetter domenenavn til IP-adresser",
                    "Digital Network Service - Krypterer nettverkstrafikk",
                    "Data Name Server - Lagrer nettsider",
                    "Domain Network System - Sender e-post"
                ],
                answer: "Domain Name System - Oversetter domenenavn til IP-adresser"
            },
            {
                question: "Hvilken port bruker HTTP vanligvis?",
                options: ["80", "443", "21", "25"],
                answer: "80"
            },
            {
                question: "Hva er en router?",
                options: [
                    "En enhet som sender datapakker mellom nettverk",
                    "En type kabel for nettverk",
                    "Et program for å surfe på nettet",
                    "En sikkerhetsprotokoll"
                ],
                answer: "En enhet som sender datapakker mellom nettverk"
            }
        ],
        sikkerhet: [
            {
                question: "Hva står CIA for i informasjonssikkerhet?",
                options: [
                    "Confidentiality, Integrity, Availability",
                    "Central Intelligence Agency", 
                    "Computer Information Access",
                    "Cyber Incident Analysis"
                ],
                answer: "Confidentiality, Integrity, Availability"
            },
            {
                question: "Hva er en DDoS-angrep og hvordan virker det?",
                options: [
                    "Distributed Denial of Service - Overbelaster en tjeneste med trafikk",
                    "Digital Data Overload System - Stjeler passord",
                    "Direct Disk Operation Service - Sletter data",
                    "Data Destruction on Server - Endrer nettsider"
                ],
                answer: "Distributed Denial of Service - Overbelaster en tjeneste med trafikk"
            },
            {
                question: "Hva er forskjellen mellom symmetrisk og asymmetrisk kryptering?",
                options: [
                    "Symmetrisk bruker én nøkkel, asymmetrisk bruker to nøkler",
                    "Symmetrisk er raskere, asymmetrisk er sikrere",
                    "Symmetrisk brukes til e-post, asymmetrisk til nettsider",
                    "Symmetrisk er eldre teknologi"
                ],
                answer: "Symmetrisk bruker én nøkkel, asymmetrisk bruker to nøkler"
            },
            {
                question: "Hva er phishing?",
                options: [
                    "Et angrep der brukere lures til å gi fra seg sensitiv informasjon",
                    "En type virus som spres via e-post",
                    "Et angrep på nettverksinfrastruktur",
                    "En metode for å kryptere data"
                ],
                answer: "Et angrep der brukere lures til å gi fra seg sensitiv informasjon"
            },
            {
                question: "Hva er en firewall?",
                options: [
                    "En sikkerhetsbarriere som kontrollerer nettverkstrafikk",
                    "Et program for å fjerne virus",
                    "En type krypteringsalgoritme",
                    "En database for sikkerhetslogger"
                ],
                answer: "En sikkerhetsbarriere som kontrollerer nettverkstrafikk"
            }
        ],
        programmering: [
            {
                question: "Hva er binært tallsystem og hvordan konverteres 25 til binært?",
                options: [
                    "Base 2 system - 25 = 11001",
                    "Base 10 system - 25 = 10101", 
                    "Base 8 system - 25 = 11000",
                    "Base 16 system - 25 = 10011"
                ],
                answer: "Base 2 system - 25 = 11001"
            },
            {
                question: "Hva er heksadesimalt tallsystem og hvordan konverteres 255 til hex?",
                options: [
                    "Base 16 system - 255 = FF",
                    "Base 2 system - 255 = 11111111",
                    "Base 8 system - 255 = 377",
                    "Base 10 system - 255 = 255"
                ],
                answer: "Base 16 system - 255 = FF"
            },
            {
                question: "Hva er ASCII og hva brukes det til?",
                options: [
                    "American Standard Code for Information Interchange - Tegnkoding",
                    "Advanced System for Computer Information - Minnehåndtering",
                    "Application Standard Code Interface - Programmering",
                    "Automated System for Code Implementation - Kompilering"
                ],
                answer: "American Standard Code for Information Interchange - Tegnkoding"
            },
            {
                question: "Hva er en CPU?",
                options: [
                    "Central Processing Unit - Datamaskinens hjerne",
                    "Computer Power Unit - Strømforsyning",
                    "Central Program Utility - Operativsystem",
                    "Computer Processing Unit - Grafikkprosessor"
                ],
                answer: "Central Processing Unit - Datamaskinens hjerne"
            },
            {
                question: "Hva er RAM?",
                options: [
                    "Random Access Memory - Arbeidsminne for prosessoren",
                    "Readily Available Memory - Lagringsminne",
                    "Rapid Access Module - Hurtigminne",
                    "Random Allocation Memory - Reservert minne"
                ],
                answer: "Random Access Memory - Arbeidsminne for prosessoren"
            }
        ],
        maskinvare: [
            {
                question: "Hva er en ALU og hva gjør den?",
                options: [
                    "Arithmetic Logic Unit - Utfører matematiske og logiske operasjoner",
                    "Advanced Logic Unit - Kontrollerer prosessoren",
                    "Automated Learning Unit - Lærer av data",
                    "Application Logic Utility - Kjøre programmer"
                ],
                answer: "Arithmetic Logic Unit - Utfører matematiske og logiske operasjoner"
            },
            {
                question: "Hvilken logisk port gir output 1 bare når begge input er 1?",
                options: ["AND-port", "OR-port", "XOR-port", "NOT-port"],
                answer: "AND-port"
            },
            {
                question: "Hva er en flip-flop og hva brukes den til?",
                options: [
                    "Et minneelement som kan lagre en bit",
                    "En type transistor for forsterkning",
                    "En feil i kretsen som må rettes",
                    "En måleenhet for spenning"
                ],
                answer: "Et minneelement som kan lagre en bit"
            },
            {
                question: "Hva er en transistor?",
                options: [
                    "En halvlederkomponent som kan forsterke eller svitsje signaler",
                    "En type motstand i kretser",
                    "En enhet for datalagring",
                    "En måleenhet for strøm"
                ],
                answer: "En halvlederkomponent som kan forsterke eller svitsje signaler"
            },
            {
                question: "Hva er cache-minne?",
                options: [
                    "Hurtigminne som lagrer ofte brukte data",
                    "Hovedminnet i datamaskinen",
                    "Eksternt lagringsmedium",
                    "Sikkerhetskopi av data"
                ],
                answer: "Hurtigminne som lagrer ofte brukte data"
            }
        ]
    };
    
    return questionSets[theme] || questionSets.nettverk;
}