// 1020 Begrep Memory spill
function initConceptMemoryGame(theme) {
    const conceptDisplay = document.getElementById('concept-display');
    const conceptSeen = document.getElementById('concept-seen');
    const conceptNew = document.getElementById('concept-new');
    const conceptMessage = document.getElementById('concept-message');
    const conceptLives = document.getElementById('concept-lives');
    const conceptScore = document.getElementById('concept-score');
    const conceptRestart = document.getElementById('concept-restart');
    
    // Game state
    let lives = 3;
    let score = 0;
    let seenConcepts = new Set();
    let currentConcept = null;
    let concepts = [];
    
    // Initialize game
    startGame();
    
    function startGame() {
        lives = 3;
        score = 0;
        seenConcepts.clear();
        concepts = getConcepts(theme);
        
        // Update UI
        updateStats();
        conceptMessage.textContent = '';
        
        // Show first concept
        showRandomConcept();
    }
    
    function showRandomConcept() {
        if (concepts.length === 0) {
            conceptDisplay.textContent = 'Ingen flere begreper!';
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * concepts.length);
        currentConcept = concepts[randomIndex];
        conceptDisplay.textContent = currentConcept;
    }
    
    function handleSeen() {
        if (seenConcepts.has(currentConcept)) {
            // Correct - have seen before
            score++;
            showMessage('Riktig! +1 poeng', 'success');
        } else {
            // Wrong - haven't seen before
            lives--;
            showMessage('Feil! Du har ikke sett dette før', 'failure');
        }
        nextConcept();
    }
    
    function handleNew() {
        if (!seenConcepts.has(currentConcept)) {
            // Correct - haven't seen before
            score++;
            showMessage('Riktig! +1 poeng', 'success');
            seenConcepts.add(currentConcept);
        } else {
            // Wrong - have seen before
            lives--;
            showMessage('Feil! Du har sett dette før', 'failure');
        }
        nextConcept();
    }
    
    function nextConcept() {
        updateStats();
        
        if (lives <= 0) {
            conceptDisplay.textContent = 'Game Over!';
            conceptMessage.textContent = `Sluttscore: ${score}`;
            return;
        }
        
        setTimeout(() => {
            showRandomConcept();
        }, 1500);
    }
    
    function updateStats() {
        conceptLives.textContent = lives;
        conceptScore.textContent = score;
    }
    
    function showMessage(message, type) {
        conceptMessage.textContent = message;
        conceptMessage.className = `concept-message ${type}`;
    }
    
    // Event listeners
    conceptSeen.addEventListener('click', handleSeen);
    conceptNew.addEventListener('click', handleNew);
    
    // Restart button
    conceptRestart.addEventListener('click', startGame);
}

function getConcepts(theme) {
    const conceptSets = {
        nettverk: [
            'HTTP', 'TCP', 'IP', 'DNS', 'LAN', 'WAN', 'MAC', 'UDP',
            'ROUTER', 'SWITCH', 'PACKET', 'SOCKET', 'PORT', 'SUBNET',
            'GATEWAY', 'PROXY', 'VPN', 'NAT', 'DHCP', 'ARP'
        ],
        sikkerhet: [
            'CIA', 'DDoS', 'VPN', 'PKI', 'SSL', 'IDS', 'MALWARE',
            'FIREWALL', 'ENCRYPTION', 'AUTHENTICATION', 'AUTHORIZATION',
            'PHISHING', 'SPOOFING', 'SNIFFING', 'KEYLOGGER', 'TROJAN',
            'VIRUS', 'WORM', 'ROOTKIT', 'BACKDOOR'
        ],
        programmering: [
            'CPU', 'RAM', 'ALU', 'ASCII', 'UTF-8', 'BINARY', 'HEX',
            'OCTAL', 'VARIABLE', 'FUNCTION', 'OBJECT', 'STRING',
            'ARRAY', 'LOOP', 'CONDITIONAL', 'ALGORITHM', 'COMPILER',
            'INTERPRETER', 'DEBUGGING', 'SYNTAX'
        ],
        maskinvare: [
            'AND', 'OR', 'XOR', 'NAND', 'NOR', 'FLIPFLOP', 'REGISTER',
            'CACHE', 'DEVICE', 'SOCKET', 'BUFFER', 'SENSOR', 'CIRCUIT',
            'PROCESSOR', 'TRANSISTOR', 'CAPACITOR', 'RESISTOR', 'DIODE',
            'MOTHERBOARD', 'BUS'
        ]
    };
    
    return conceptSets[theme] || conceptSets.nettverk;
}