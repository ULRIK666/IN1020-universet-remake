// Spesifisert Øving spill - MED TILFELDIGE SVARALTERNATIVER
function initPracticeGame(theme) {
    const practiceCategories = document.getElementById('practice-categories');
    const practiceContent = document.getElementById('practice-content');
    const practiceScore = document.getElementById('practice-score');
    const practiceCorrect = document.getElementById('practice-correct');
    const practiceRestart = document.getElementById('practice-restart');
    
    // Game state
    let score = 0;
    let correctAnswers = 0;
    let currentCategory = null;
    
    // Initialize game
    startGame();
    
    function startGame() {
        score = 0;
        correctAnswers = 0;
        currentCategory = null;
        
        // Update UI
        practiceScore.textContent = score;
        practiceCorrect.textContent = correctAnswers;
        
        // Show categories
        showCategories();
    }
    
    function showCategories() {
        practiceContent.innerHTML = '<h3 style="text-align: center; margin: 20px 0;">Velg en kategori å øve på</h3>';
        practiceCategories.innerHTML = '';
        
        const categories = getPracticeCategories(theme);
        
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'practice-category';
            categoryElement.innerHTML = `
                <h3>${category.name}</h3>
                <p>${category.description}</p>
            `;
            
            categoryElement.addEventListener('click', () => {
                currentCategory = category;
                showPracticeQuestion();
            });
            
            practiceCategories.appendChild(categoryElement);
        });
    }
    
    function showPracticeQuestion() {
        practiceCategories.innerHTML = '';
        
        const question = getPracticeQuestion(currentCategory);
        if (!question) {
            practiceContent.innerHTML = '<p>Ingen spørsmål tilgjengelig for denne kategorien.</p>';
            return;
        }
        
        let contentHTML = '';
        
        if (question.type === 'multiple-choice') {
            // Shuffle options randomly
            const shuffledOptions = shuffleArray([...question.options]);
            
            contentHTML = `
                <div class="practice-question">${question.question}</div>
                <div class="practice-multiple-choice">
                    ${shuffledOptions.map(option => 
                        `<div class="tictactoe-option">${option}</div>`
                    ).join('')}
                </div>
            `;
        } else if (question.type === 'binary') {
            contentHTML = `
                <div class="practice-question">${question.question}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="Skriv binært tall her">
                    <button class="btn" id="practice-submit">Svar</button>
                </div>
            `;
        } else if (question.type === 'hex') {
            contentHTML = `
                <div class="practice-question">${question.question}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="Skriv heksadesimalt tall her">
                    <button class="btn" id="practice-submit">Svar</button>
                </div>
            `;
        } else if (question.type === 'octal') {
            contentHTML = `
                <div class="practice-question">${question.question}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="Skriv oktalt tall her">
                    <button class="btn" id="practice-submit">Svar</button>
                </div>
            `;
        } else if (question.type === 'calculation') {
            contentHTML = `
                <div class="practice-question">${question.question}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="Skriv svaret her">
                    <button class="btn" id="practice-submit">Svar</button>
                </div>
            `;
        } else if (question.type === 'multiple-correct') {
            contentHTML = `
                <div class="practice-question">${question.question}</div>
                <div class="practice-multiple-choice">
                    ${question.options.map((option, index) => 
                        `<div class="tictactoe-option" data-correct="${option.correct}" data-index="${index}">${option.text}</div>`
                    ).join('')}
                </div>
                <button class="btn" id="practice-check" style="margin-top: 20px;">Sjekk svar</button>
            `;
        }
        
        practiceContent.innerHTML = contentHTML;
        
        // Add event listeners based on question type
        if (question.type === 'multiple-choice') {
            document.querySelectorAll('.tictactoe-option').forEach(option => {
                option.addEventListener('click', () => {
                    handleAnswer(option.textContent === question.answer, question);
                });
            });
        } else if (question.type === 'binary' || question.type === 'hex' || question.type === 'octal' || question.type === 'calculation') {
            document.getElementById('practice-submit').addEventListener('click', () => {
                const answer = document.getElementById('practice-answer').value.trim();
                handleAnswer(answer === question.answer, question);
            });
            
            document.getElementById('practice-answer').addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    const answer = document.getElementById('practice-answer').value.trim();
                    handleAnswer(answer === question.answer, question);
                }
            });
        } else if (question.type === 'multiple-correct') {
            let selectedOptions = [];
            
            document.querySelectorAll('.tictactoe-option').forEach(option => {
                option.addEventListener('click', () => {
                    option.classList.toggle('selected');
                    const isCorrect = option.getAttribute('data-correct') === 'true';
                    
                    if (option.classList.contains('selected')) {
                        selectedOptions.push({correct: isCorrect});
                    } else {
                        const index = selectedOptions.findIndex(opt => opt.correct === isCorrect);
                        if (index > -1) {
                            selectedOptions.splice(index, 1);
                        }
                    }
                });
            });
            
            document.getElementById('practice-check').addEventListener('click', () => {
                const correctOptions = question.options.filter(opt => opt.correct).length;
                const userCorrect = selectedOptions.filter(opt => opt.correct).length;
                const userIncorrect = selectedOptions.filter(opt => !opt.correct).length;
                
                const allCorrect = userCorrect === correctOptions && userIncorrect === 0;
                handleAnswer(allCorrect, question);
            });
        }
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    function handleAnswer(isCorrect, question) {
        if (isCorrect) {
            score += 10;
            correctAnswers++;
            showMessage('Riktig! +10 poeng', 'success');
        } else {
            let correctAnswer = question.answer;
            if (question.type === 'multiple-correct') {
                const correctOptions = question.options.filter(opt => opt.correct).map(opt => opt.text);
                correctAnswer = correctOptions.join(', ');
            }
            showMessage(`Feil! Riktig svar: ${correctAnswer}`, 'failure');
        }
        
        practiceScore.textContent = score;
        practiceCorrect.textContent = correctAnswers;
        
        setTimeout(() => {
            showPracticeQuestion();
        }, 2000);
    }
    
    function showMessage(message, type) {
        // Fjern gamle meldinger
        const oldMessages = practiceContent.querySelectorAll('.concept-message');
        oldMessages.forEach(msg => msg.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = `concept-message ${type}`;
        messageElement.textContent = message;
        practiceContent.appendChild(messageElement);
    }
    
    // Restart button
    practiceRestart.addEventListener('click', startGame);
}

function getPracticeCategories(theme) {
    const categories = {
        nettverk: [
            {
                name: 'Protokoller',
                description: 'TCP/IP, HTTP, DNS, SMTP og andre nettverksprotokoller',
                type: 'multiple-choice'
            },
            {
                name: 'IP-adresser og Subnett',
                description: 'IPv4, IPv6, subnetting og nettverksmasker',
                type: 'multiple-choice'
            },
            {
                name: 'Nettverksarkitektur',
                description: 'OSI-modellen, TCP/IP-modellen, rutere og switcher',
                type: 'multiple-choice'
            },
            {
                name: 'Nedlastningsberegning',
                description: 'Beregn nedlastningstid fra båndbredde og filstørrelse',
                type: 'calculation'
            }
        ],
        sikkerhet: [
            {
                name: 'KIT (CIA)',
                description: 'Konfidensialitet, Integritet, Tilgjengelighet',
                type: 'multiple-choice'
            },
            {
                name: 'Kryptering',
                description: 'Symmetrisk, asymmetrisk, hash-funksjoner og sertifikater',
                type: 'multiple-choice'
            },
            {
                name: 'Angrepstyper',
                description: 'DDoS, phishing, malware, social engineering',
                type: 'multiple-correct'
            },
            {
                name: 'Sikkerhetsmekanismer',
                description: 'Brannmurer, IDS/IPS, VPN, to-faktor autentisering',
                type: 'multiple-choice'
            }
        ],
        programmering: [
            {
                name: 'Binære Tall',
                description: 'Konvertering mellom desimal og binært',
                type: 'binary'
            },
            {
                name: 'Heksadesimale Tall',
                description: 'Konvertering mellom desimal og heksadesimalt',
                type: 'hex'
            },
            {
                name: 'Oktale Tall',
                description: 'Konvertering mellom desimal og oktalt',
                type: 'octal'
            },
            {
                name: 'Assemblerkode',
                description: 'Grunnleggende assemblerinstruksjoner og registre',
                type: 'multiple-choice'
            }
        ],
        maskinvare: [
            {
                name: 'Logiske Porter',
                description: 'AND, OR, NOT, NAND, NOR, XOR porter',
                type: 'multiple-choice'
            },
            {
                name: 'CPU og Minne',
                description: 'Prosessorer, cache, RAM, ROM og lagringshierarki',
                type: 'multiple-choice'
            },
            {
                name: 'Bussystemer',
                description: 'Adressebuss, databuss, kontrollbuss',
                type: 'multiple-choice'
            },
            {
                name: 'Minnekretser',
                description: 'Flip-flops, registre og minneorganisering',
                type: 'multiple-choice'
            }
        ]
    };
    
    return categories[theme] || categories.sikkerhet;
}

function getPracticeQuestion(category) {
    if (!category) return null;
    
    // Spørsmål for Protokoller (Nettverk)
    if (category.name === 'Protokoller') {
        const questions = [
            {
                type: 'multiple-choice',
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
                type: 'multiple-choice',
                question: "Hvilken port bruker HTTP vanligvis?",
                options: ["80", "443", "21", "25"],
                answer: "80"
            },
            {
                type: 'multiple-choice',
                question: "Hva er hovedoppgaven til DNS?",
                options: [
                    "Oversette domenenavn til IP-adresser",
                    "Kryptere data",
                    "Sende e-post", 
                    "Blokkere skadelig trafikk"
                ],
                answer: "Oversette domenenavn til IP-adresser"
            }
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    // Spørsmål for Binære Tall (Programmering)
    if (category.name === 'Binære Tall') {
        const decimal = Math.floor(Math.random() * 100) + 1;
        return {
            type: 'binary',
            question: `Hva er ${decimal} i binært?`,
            answer: decimal.toString(2)
        };
    }
    
    // Spørsmål for Heksadesimale Tall (Programmering)
    if (category.name === 'Heksadesimale Tall') {
        const decimal = Math.floor(Math.random() * 255) + 1;
        return {
            type: 'hex',
            question: `Hva er ${decimal} i heksadesimalt?`,
            answer: decimal.toString(16).toUpperCase()
        };
    }
    
    // Spørsmål for Oktale Tall (Programmering)
    if (category.name === 'Oktale Tall') {
        const decimal = Math.floor(Math.random() * 100) + 1;
        return {
            type: 'octal',
            question: `Hva er ${decimal} i oktalt?`,
            answer: decimal.toString(8)
        };
    }
    
    // Spørsmål for Angrepstyper (Sikkerhet)
    if (category.name === 'Angrepstyper') {
        return {
            type: 'multiple-correct',
            question: 'Hvilke angrepstyper lytter på maskinen? (Velg alle som passer)',
            options: [
                { text: 'Keylogger', correct: true },
                { text: 'DDoS', correct: false },
                { text: 'Sniffing', correct: true },
                { text: 'Phishing', correct: false },
                { text: 'Man-in-the-middle', correct: true }
            ]
        };
    }
    
    // Spørsmål for KIT (Sikkerhet)
    if (category.name === 'KIT (CIA)') {
        return {
            type: 'multiple-choice',
            question: "Hva står CIA for i informasjonssikkerhet?",
            options: [
                "Confidentiality, Integrity, Availability",
                "Central Intelligence Agency", 
                "Computer Information Access",
                "Cyber Incident Analysis"
            ],
            answer: "Confidentiality, Integrity, Availability"
        };
    }
    
    // Standard fallback spørsmål
    return {
        type: 'multiple-choice',
        question: 'Hva er hovedforskjellen mellom TCP og UDP?',
        options: [
            'TCP er pålitelig med feilkontroll, UDP er ikke',
            'TCP er raskere enn UDP',
            'UDP bruker porter, TCP gjør ikke',
            'TCP er for trådløse nettverk'
        ],
        answer: 'TCP er pålitelig med feilkontroll, UDP er ikke'
    };
}