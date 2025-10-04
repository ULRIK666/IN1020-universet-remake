// Memory Game functionality - FIKSET VERSJON
function initMemoryGame(theme) {
    const memoryBoard = document.getElementById('memory-board');
    const player1Info = document.getElementById('player1-info');
    const player2Info = document.getElementById('player2-info');
    const playerTurnAbove = document.getElementById('player-turn-above');
    const turnMessage = document.getElementById('turn-message');
    const memoryRestart = document.getElementById('memory-restart');
    const changePlayersBtn = document.getElementById('memory-change-players');
    
    // Game state
    let players = 1;
    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    let totalPairs = 0;
    
    // Initialize game
    startGame();
    
    function startGame() {
        // Clear the board
        memoryBoard.innerHTML = '';
        
        // Reset scores
        player1Score = 0;
        player2Score = 0;
        matchedPairs = 0;
        
        // Get cards based on theme
        const cards = getMemoryCards(theme);
        totalPairs = cards.length / 2;
        
        // Shuffle cards
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        
        // Reset game state
        flippedCards = [];
        currentPlayer = 1;
        canFlip = true;
        
        // Update UI
        updateScores();
        updatePlayerTurn();
        player1Info.classList.add('active');
        if (players === 2) {
            player2Info.classList.remove('active');
        }
        
        // Create card elements
        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.setAttribute('data-index', index);
            cardElement.setAttribute('data-id', card.id);
            
            const front = document.createElement('div');
            front.className = 'front';
            front.textContent = '?';
            
            const back = document.createElement('div');
            back.className = 'back';
            
            // Vis enten begrep eller definisjon basert på type
            if (card.type === 'term') {
                back.textContent = card.content;
                back.style.fontWeight = 'bold';
                back.style.fontSize = '1.4rem';
            } else {
                back.textContent = card.definition;
                back.style.fontSize = '0.9rem';
                back.style.padding = '5px';
            }
            
            cardElement.appendChild(front);
            cardElement.appendChild(back);
            
            cardElement.addEventListener('click', () => {
                if (canFlip && flippedCards.length < 2 && 
                    !cardElement.classList.contains('flipped') && 
                    !cardElement.classList.contains('matched')) {
                    
                    flipCard(cardElement);
                }
            });
            
            memoryBoard.appendChild(cardElement);
        });
    }
    
    function flipCard(cardElement) {
        cardElement.classList.add('flipped');
        flippedCards.push(cardElement);
        
        if (flippedCards.length === 2) {
            canFlip = false;
            setTimeout(checkMatch, 1000);
        }
    }
    
    function checkMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
        
        const id1 = card1.getAttribute('data-id');
        const id2 = card2.getAttribute('data-id');
        
        if (id1 === id2) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            // Update score
            if (currentPlayer === 1) {
                player1Score += 10;
            } else {
                player2Score += 10;
            }
            updateScores();
            
            // Show success message
            showTurnMessage(`Spiller ${currentPlayer} fikk et match!`, 'success');
            
            // Check if game is complete
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    if (players === 1) {
                        showTurnMessage(`Gratulerer! Du fullførte spillet med ${player1Score} poeng!`, 'success');
                    } else {
                        let winner = player1Score > player2Score ? 'Spiller 1' : 
                                    player2Score > player1Score ? 'Spiller 2' : 'Det ble uavgjort';
                        showTurnMessage(`Spillet er over! ${winner} vant!`, 'success');
                    }
                }, 1000);
            }
        } else {
            // No match
            card1.classList.add('incorrect');
            card2.classList.add('incorrect');
            
            setTimeout(() => {
                card1.classList.remove('flipped', 'incorrect');
                card2.classList.remove('flipped', 'incorrect');
                
                // Switch player if multiplayer
                if (players === 2) {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    updatePlayerTurn();
                }
                
                showTurnMessage(`Spiller ${currentPlayer} sin tur`, 'info');
            }, 1000);
        }
        
        flippedCards = [];
        canFlip = true;
    }
    
    function updateScores() {
        document.querySelector('#player1-info .score').textContent = `${player1Score} poeng`;
        if (players === 2) {
            document.querySelector('#player2-info .score').textContent = `${player2Score} poeng`;
        }
    }
    
    function updatePlayerTurn() {
        if (players === 1) {
            playerTurnAbove.textContent = `Din tur`;
            playerTurnAbove.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
        } else {
            playerTurnAbove.textContent = `Spiller ${currentPlayer} sin tur`;
            playerTurnAbove.style.backgroundColor = currentPlayer === 1 ? 
                'rgba(52, 152, 219, 0.3)' : 'rgba(231, 76, 60, 0.3)';
        }
        
        // Update active player highlight
        if (players === 2) {
            if (currentPlayer === 1) {
                player1Info.classList.add('active');
                player2Info.classList.remove('active');
            } else {
                player1Info.classList.remove('active');
                player2Info.classList.add('active');
            }
        }
    }
    
    function showTurnMessage(message, type) {
        turnMessage.textContent = message;
        turnMessage.className = 'turn-message';
        
        if (type === 'success') {
            turnMessage.style.color = 'var(--secondary)';
            turnMessage.style.fontSize = '2rem';
        } else if (type === 'info') {
            turnMessage.style.color = 'var(--primary)';
            turnMessage.style.fontSize = '1.5rem';
        }
        
        setTimeout(() => {
            turnMessage.textContent = '';
            turnMessage.style.fontSize = '';
        }, 2000);
    }
    
    // Restart button
    memoryRestart.addEventListener('click', startGame);
    
    // Change players button
    changePlayersBtn.addEventListener('click', () => {
        players = players === 1 ? 2 : 1;
        
        if (players === 1) {
            player2Info.style.display = 'none';
            changePlayersBtn.textContent = 'Spill med 2 spillere';
        } else {
            player2Info.style.display = 'flex';
            changePlayersBtn.textContent = 'Spill alene';
        }
        
        startGame();
    });
    
    // Initialize with single player
    player2Info.style.display = 'none';
    changePlayersBtn.textContent = 'Spill med 2 spillere';
}

function getMemoryCards(theme) {
    // Define cards based on theme - terms and their definitions
    const cardSets = {
        nettverk: [
            { id: 1, type: 'term', content: 'HTTP' },
            { id: 1, type: 'definition', definition: 'Hypertext Transfer Protocol - Protokoll for nettsider' },
            { id: 2, type: 'term', content: 'TCP' },
            { id: 2, type: 'definition', definition: 'Transmission Control Protocol - Pålitelig datatransport' },
            { id: 3, type: 'term', content: 'IP' },
            { id: 3, type: 'definition', definition: 'Internet Protocol - Unik adresse på nettverk' },
            { id: 4, type: 'term', content: 'DNS' },
            { id: 4, type: 'definition', definition: 'Domain Name System - Oversetter navn til IP-adresser' },
            { id: 5, type: 'term', content: 'LAN' },
            { id: 5, type: 'definition', definition: 'Local Area Network - Lokalt nettverk' },
            { id: 6, type: 'term', content: 'WAN' },
            { id: 6, type: 'definition', definition: 'Wide Area Network - Stort geografisk nettverk' },
            { id: 7, type: 'term', content: 'MAC' },
            { id: 7, type: 'definition', definition: 'Media Access Control - Unik nettverksadresse' },
            { id: 8, type: 'term', content: 'UDP' },
            { id: 8, type: 'definition', definition: 'User Datagram Protocol - Rask, upålitelig protokoll' }
        ],
        sikkerhet: [
            { id: 1, type: 'term', content: 'CIA' },
            { id: 1, type: 'definition', definition: 'Confidentiality, Integrity, Availability - Grunnleggende sikkerhetsprinsipper' },
            { id: 2, type: 'term', content: 'DDoS' },
            { id: 2, type: 'definition', definition: 'Distributed Denial of Service - Overbelastningsangrep' },
            { id: 3, type: 'term', content: 'VPN' },
            { id: 3, type: 'definition', definition: 'Virtual Private Network - Sikker nettverkstilkobling' },
            { id: 4, type: 'term', content: 'PKI' },
            { id: 4, type: 'definition', definition: 'Public Key Infrastructure - Digitalt nøkkelsystem' },
            { id: 5, type: 'term', content: 'SSL' },
            { id: 5, type: 'definition', definition: 'Secure Sockets Layer - Kryptert nettkommunikasjon' },
            { id: 6, type: 'term', content: 'Firewall' },
            { id: 6, type: 'definition', definition: 'Sikkerhetsbarriere mot nettverksangrep' },
            { id: 7, type: 'term', content: 'Phishing' },
            { id: 7, type: 'definition', definition: 'Utnyttelse via falske e-poster' },
            { id: 8, type: 'term', content: 'Malware' },
            { id: 8, type: 'definition', definition: 'Skadelig programvare' }
        ],
        programmering: [
            { id: 1, type: 'term', content: 'CPU' },
            { id: 1, type: 'definition', definition: 'Central Processing Unit - Hovedprosessor' },
            { id: 2, type: 'term', content: 'RAM' },
            { id: 2, type: 'definition', definition: 'Random Access Memory - Arbeidsminne' },
            { id: 3, type: 'term', content: 'ALU' },
            { id: 3, type: 'definition', definition: 'Arithmetic Logic Unit - Regneenhet i CPU' },
            { id: 4, type: 'term', content: 'ASCII' },
            { id: 4, type: 'definition', definition: 'American Standard Code - Tegnkoding' },
            { id: 5, type: 'term', content: 'Binær' },
            { id: 5, type: 'definition', definition: 'Tallsystem med grunntall 2' },
            { id: 6, type: 'term', content: 'Hex' },
            { id: 6, type: 'definition', definition: 'Heksadesimalt - Tallsystem med grunntall 16' },
            { id: 7, type: 'term', content: 'Oktal' },
            { id: 7, type: 'definition', definition: 'Tallsystem med grunntall 8' },
            { id: 8, type: 'term', content: 'Bit' },
            { id: 8, type: 'definition', definition: 'Binært siffer - Minste databenhet' }
        ],
        maskinvare: [
            { id: 1, type: 'term', content: 'AND' },
            { id: 1, type: 'definition', definition: 'Logisk OG-port - Output 1 kun ved to 1-ere' },
            { id: 2, type: 'term', content: 'OR' },
            { id: 2, type: 'definition', definition: 'Logisk ELLER-port - Output 1 ved minst en 1-er' },
            { id: 3, type: 'term', content: 'XOR' },
            { id: 3, type: 'definition', definition: 'Eksklusiv ELLER-port - Output 1 ved ulike input' },
            { id: 4, type: 'term', content: 'NAND' },
            { id: 4, type: 'definition', definition: 'Ikke-OG-port - Invertert AND' },
            { id: 5, type: 'term', content: 'NOR' },
            { id: 5, type: 'definition', definition: 'Ikke-ELLER-port - Invertert OR' },
            { id: 6, type: 'term', content: 'Cache' },
            { id: 6, type: 'definition', definition: 'Hurtigminne for ofte brukte data' },
            { id: 7, type: 'term', content: 'Register' },
            { id: 7, type: 'definition', definition: 'Lite, hurtig minne i CPU' },
            { id: 8, type: 'term', content: 'Bus' },
            { id: 8, type: 'definition', definition: 'Databane mellom komponenter' }
        ]
    };
    
    return cardSets[theme] || cardSets.nettverk;
}