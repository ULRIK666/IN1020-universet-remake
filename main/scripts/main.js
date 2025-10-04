// Hoved app-logikk
class GameApp {
    constructor() {
        this.currentPage = 'home';
        this.currentTheme = '';
        this.currentGame = '';
        this.init();
    }

    init() {
        this.createStars();
        this.setupNavigation();
        this.showHomePage();
        
        // Start bakgrunnsanimasjoner
        this.startBackgroundAnimations();
    }

    setupNavigation() {
        // Hovedmeny navigasjon
        document.getElementById('solo-btn').addEventListener('click', () => {
            this.showThemeSelection();
        });
        
        document.getElementById('theme-back-btn').addEventListener('click', () => {
            this.showHomePage();
        });
        
        document.getElementById('game-back-btn').addEventListener('click', () => {
            this.showThemeSelection();
        });

        // Tilbake-knapper for spill
        const backButtons = [
            'memory-back-btn', 'quiz-back-btn', 'wordle-back-btn',
            'tictactoe-back-btn', 'practice-back-btn', 
            'binary-memory-back-btn', 'concept-memory-back-btn',
            'dart-back-btn', 'tugofwar-back-btn'
        ];
        
        backButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.showGameSelection();
                });
            }
        });

        // Tema valg
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                this.currentTheme = card.getAttribute('data-theme');
                this.showGameSelection();
            });
        });

        // Spill valg - ENDRET: Legg til event listener på selve kortet, ikke bare knappen
        document.querySelectorAll('.mode-card[data-game]').forEach(card => {
            card.addEventListener('click', (e) => {
                // Forhindre at klikk på knappen utløser to ganger
                if (e.target.classList.contains('btn')) {
                    return;
                }
                this.currentGame = card.getAttribute('data-game');
                this.loadGame(this.currentGame);
            });
            
            // Legg også til event listener på knappen selv
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('click', () => {
                    this.currentGame = card.getAttribute('data-game');
                    this.loadGame(this.currentGame);
                });
            }
        });
    }

    showHomePage() {
        this.hideAllSections();
        document.getElementById('main-menu').style.display = 'block';
        this.currentPage = 'home';
    }

    showThemeSelection() {
        this.hideAllSections();
        document.getElementById('theme-selection').style.display = 'block';
        this.currentPage = 'theme';
    }

    showGameSelection() {
        this.hideAllSections();
        document.getElementById('game-selection').style.display = 'block';
        this.currentPage = 'game';
    }

    hideAllSections() {
        const sections = [
            'main-menu', 'theme-selection', 'game-selection',
            'memory-game-area', 'quiz-game-area', 'wordle-game-area',
            'tictactoe-game-area', 'practice-game-area',
            'binary-memory-game-area', 'concept-memory-game-area',
            'dart-game-area', 'tugofwar-game-area'
        ];
        
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    loadGame(gameName) {
        this.hideAllSections();
        
        console.log(`Loading game: ${gameName} with theme: ${this.currentTheme}`);
        
        switch(gameName) {
            case 'memory':
                document.getElementById('memory-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initMemoryGame === 'function') {
                        initMemoryGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'quiz':
                document.getElementById('quiz-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initQuizGame === 'function') {
                        initQuizGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'wordle':
                document.getElementById('wordle-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initWordleGame === 'function') {
                        initWordleGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'tictactoe':
                document.getElementById('tictactoe-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initTicTacToeGame === 'function') {
                        initTicTacToeGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'practice':
                document.getElementById('practice-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initPracticeGame === 'function') {
                        initPracticeGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'binary-memory':
                document.getElementById('binary-memory-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initBinaryMemoryGame === 'function') {
                        initBinaryMemoryGame();
                    }
                }, 100);
                break;
            case 'concept-memory':
                document.getElementById('concept-memory-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initConceptMemoryGame === 'function') {
                        initConceptMemoryGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'dart':
                document.getElementById('dart-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initDartGame === 'function') {
                        initDartGame(this.currentTheme);
                    }
                }, 100);
                break;
            case 'tugofwar':
                document.getElementById('tugofwar-game-area').style.display = 'block';
                setTimeout(() => {
                    if (typeof initTugOfWarGame === 'function') {
                        initTugOfWarGame(this.currentTheme);
                    }
                }, 100);
                break;
            default:
                console.warn(`Unknown game: ${gameName}`);
                this.showGameSelection();
        }
    }

    // Bakgrunnsanimasjoner med forbedrede planeter
    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;
        
        const starCount = 200;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3;
            const delay = Math.random() * 5;
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }

    createPlanets() {
        const planetsContainer = document.getElementById('planets');
        if (!planetsContainer) return;
        
        const planetCount = 6;
        
        // Planet teksturer og farger for 3D-effekt
        const planetStyles = [
            {
                // Jord-lignende planet
                gradient: 'radial-gradient(circle at 30% 30%, #4a8fd9, #2c5282, #1a365d)',
                shadow: '0 0 40px rgba(74, 143, 217, 0.6)',
                texture: 'repeating-radial-gradient(circle at 30% 30%, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
            },
            {
                // Mars-lignende planet
                gradient: 'radial-gradient(circle at 30% 30%, #e27c60, #c53030, #742a2a)',
                shadow: '0 0 40px rgba(229, 62, 62, 0.6)',
                texture: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px)'
            },
            {
                // Gass-gigant
                gradient: 'radial-gradient(circle at 30% 30%, #f6ad55, #ed8936, #dd6b20)',
                shadow: '0 0 50px rgba(246, 173, 85, 0.7)',
                texture: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 16px)'
            },
            {
                // Is-planet
                gradient: 'radial-gradient(circle at 30% 30%, #a0aec0, #718096, #4a5568)',
                shadow: '0 0 35px rgba(160, 174, 192, 0.5)',
                texture: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3), transparent 50%)'
            },
            {
                // Lilla planet
                gradient: 'radial-gradient(circle at 30% 30%, #9f7aea, #805ad5, #6b46c1)',
                shadow: '0 0 45px rgba(159, 122, 234, 0.6)',
                texture: 'repeating-radial-gradient(circle at 70% 20%, transparent, transparent 15px, rgba(255,255,255,0.2) 15px, rgba(255,255,255,0.2) 30px)'
            },
            {
                // Grønn planet
                gradient: 'radial-gradient(circle at 30% 30%, #48bb78, #38a169, #2f855a)',
                shadow: '0 0 40px rgba(72, 187, 120, 0.5)',
                texture: 'repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(0,0,0,0.1) 12px, rgba(0,0,0,0.1) 24px)'
            }
        ];
        
        for (let i = 0; i < planetCount; i++) {
            const planet = document.createElement('div');
            planet.className = 'planet';
            
            const size = Math.random() * 80 + 40; // 40px til 120px
            const style = planetStyles[i % planetStyles.length];
            
            // Lag en container for 3D-effekt
            const planetContainer = document.createElement('div');
            planetContainer.className = 'planet-container';
            
            // Hovedplanet med gradient
            const planetCore = document.createElement('div');
            planetCore.className = 'planet-core';
            planetCore.style.background = style.gradient;
            planetCore.style.boxShadow = style.shadow;
            
            // Legg til tekstur-lag
            const planetTexture = document.createElement('div');
            planetTexture.className = 'planet-texture';
            planetTexture.style.background = style.texture;
            
            // Legg til ekstra skygge for 3D-effekt
            const planetShading = document.createElement('div');
            planetShading.className = 'planet-shading';
            planetShading.style.background = 'radial-gradient(circle at 70% 70%, transparent 30%, rgba(0,0,0,0.4) 100%)';
            
            planetCore.appendChild(planetTexture);
            planetCore.appendChild(planetShading);
            planetContainer.appendChild(planetCore);
            planet.appendChild(planetContainer);
            
            planet.style.width = `${size}px`;
            planet.style.height = `${size}px`;
            planet.style.left = `${Math.random() * 85 + 5}%`;
            planet.style.top = `${Math.random() * 85 + 5}%`;
            planet.style.animationDelay = `${Math.random() * 20}s`;
            
            planetsContainer.appendChild(planet);
        }
    }

    startBackgroundAnimations() {
        // Lag planeter
        this.createPlanets();
        
        // Start meteor regn (oftere)
        this.startMeteorShower();
        
        // Start stjerneskudd (oftere)
        this.startShootingStars();
        
        // Start UFO animasjoner (oftere)
        this.startUFOAnimations();
    }

    startMeteorShower() {
        // Meteor hvert 5. sekund
        setInterval(() => {
            if (Math.random() < 0.4) { // 40% sjanse
                this.createMeteor();
            }
        }, 5000);
    }

    createMeteor() {
        const meteor = document.getElementById('meteor');
        if (!meteor) return;
        
        meteor.style.display = 'block';
        
        // Tilfeldig startposisjon på toppen
        const startX = Math.random() * 100;
        const endX = Math.random() * 100;
        
        meteor.style.left = startX + '%';
        meteor.style.top = '-100px';
        
        // Beregn rotasjon basert på retning - fiks for riktig retning
        const deltaX = endX - startX;
        const deltaY = 100; // Går fra top -100px til bottom 100%
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        meteor.style.transform = `rotate(${angle}deg)`;
        meteor.style.width = '120px';
        meteor.style.height = 'auto';
        
        // Lag custom keyframes
        const styleId = 'meteor-animation-' + Date.now();
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes ${styleId} {
                0% {
                    top: -100px;
                    left: ${startX}%;
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    top: 100%;
                    left: ${endX}%;
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        meteor.style.animation = 'none';
        setTimeout(() => {
            meteor.style.animation = `${styleId} 4s linear`;
        }, 10);
        
        setTimeout(() => {
            meteor.style.display = 'none';
            // Fjern keyframes etter bruk
            const oldStyle = document.getElementById(styleId);
            if (oldStyle) oldStyle.remove();
        }, 4000);
    }

    startShootingStars() {
        // Stjerneskudd hvert 3. sekund
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% sjanse
                this.createShootingStar();
            }
        }, 3000);
    }

    createShootingStar() {
        const shootingStar = document.getElementById('shooting-star');
        if (!shootingStar) return;
        
        // Tilfeldig start og slutt posisjon
        const startX = Math.random() * 80;
        const startY = Math.random() * 80;
        const endX = startX + Math.random() * 15 + 5;
        const endY = startY + Math.random() * 15 + 5;
        
        // Tilbake til enkel stjerne
        shootingStar.innerHTML = '';
        shootingStar.style.width = '4px';
        shootingStar.style.height = '4px';
        shootingStar.style.background = 'white';
        shootingStar.style.borderRadius = '50%';
        shootingStar.style.boxShadow = '0 0 10px 2px white';
        
        shootingStar.style.display = 'block';
        shootingStar.style.left = startX + '%';
        shootingStar.style.top = startY + '%';
        
        // Lag custom keyframes
        const styleId = 'shooting-star-' + Date.now();
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes ${styleId} {
                0% {
                    left: ${startX}%;
                    top: ${startY}%;
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    left: ${endX}%;
                    top: ${endY}%;
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        shootingStar.style.animation = 'none';
        setTimeout(() => {
            shootingStar.style.animation = `${styleId} 1s linear`;
        }, 10);
        
        setTimeout(() => {
            shootingStar.style.display = 'none';
            // Fjern keyframes etter bruk
            const oldStyle = document.getElementById(styleId);
            if (oldStyle) oldStyle.remove();
        }, 1000);
    }

    startUFOAnimations() {
        // UFO hvert 15. sekund
        setInterval(() => {
            this.createUFO();
        }, 15000);
    }

    createUFO() {
        const ufo = document.getElementById('ufo');
        if (!ufo) return;
        
        // Tilfeldig startposisjon (venstre eller høyre side)
        const startFromLeft = Math.random() > 0.5;
        const startY = Math.random() * 60 + 20; // 20% til 80% ned fra toppen
        
        ufo.style.display = 'block';
        ufo.style.left = startFromLeft ? '-100px' : 'calc(100% + 100px)';
        ufo.style.top = startY + '%';
        ufo.style.width = '80px';
        ufo.style.height = 'auto';
        
        // Lag smooth bane
        const styleId = 'ufo-animation-' + Date.now();
        const style = document.createElement('style');
        style.id = styleId;
        
        if (startFromLeft) {
            style.textContent = `
                @keyframes ${styleId} {
                    0% {
                        transform: translateX(0px) translateY(0px);
                        opacity: 0;
                    }
                    10% {
                        transform: translateX(100px) translateY(-20px);
                        opacity: 1;
                    }
                    30% {
                        transform: translateX(200px) translateY(10px);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(300px) translateY(-15px);
                        opacity: 1;
                    }
                    70% {
                        transform: translateX(400px) translateY(5px);
                        opacity: 1;
                    }
                    90% {
                        transform: translateX(500px) translateY(0px);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(600px) translateY(0px);
                        opacity: 0;
                    }
                }
            `;
        } else {
            style.textContent = `
                @keyframes ${styleId} {
                    0% {
                        transform: translateX(0px) translateY(0px);
                        opacity: 0;
                    }
                    10% {
                        transform: translateX(-100px) translateY(-20px);
                        opacity: 1;
                    }
                    30% {
                        transform: translateX(-200px) translateY(10px);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(-300px) translateY(-15px);
                        opacity: 1;
                    }
                    70% {
                        transform: translateX(-400px) translateY(5px);
                        opacity: 1;
                    }
                    90% {
                        transform: translateX(-500px) translateY(0px);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-600px) translateY(0px);
                        opacity: 0;
                    }
                }
            `;
        }
        
        document.head.appendChild(style);
        
        ufo.style.animation = 'none';
        setTimeout(() => {
            ufo.style.animation = `${styleId} 12s ease-in-out`;
        }, 10);
        
        setTimeout(() => {
            ufo.style.display = 'none';
            // Fjern keyframes etter bruk
            const oldStyle = document.getElementById(styleId);
            if (oldStyle) oldStyle.remove();
        }, 12000);
    }
}

// Initialiser appen når DOM-en er lastet
document.addEventListener('DOMContentLoaded', function() {
    const app = new GameApp();
    
    // Sett opp globale funksjoner for spill
    window.initMemoryGame = initMemoryGame;
    window.initQuizGame = initQuizGame;
    window.initWordleGame = initWordleGame;
    window.initTicTacToeGame = initTicTacToeGame;
    window.initPracticeGame = initPracticeGame;
    window.initBinaryMemoryGame = initBinaryMemoryGame;
    window.initConceptMemoryGame = initConceptMemoryGame;
    window.initDartGame = initDartGame;
    window.initTugOfWarGame = initTugOfWarGame;
});