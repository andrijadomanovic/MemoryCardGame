class AudioController {
    constructor(){
        this.bgMusic = new Audio('Audio/monkey.mp3');
        this.flipSound = new Audio('Audio/flip.wav');
        this.matchSound = new Audio('Audio/match.wav');
        this.victorySound = new Audio('Audio/victory.mp3');
        this.gameOverSound = new Audio('Audio/gameOver.wav');
        this.bgMusic.volume = 0.2;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class Games {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
   
     
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        },500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;

    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
            console.log(card);
        });
    }


    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0 )
            this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
  
 


    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip(); 
            this.totalClicks++;   
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.chackForeCardCheck(card);
            else
                this.cardToCheck = card;
        }
    }
    chackForeCardCheck(card) {
            if(this.getCardType(card) === this.getCardType(this.cardToCheck))
                this.cardMatch(card, this.cardToCheck);
            else
                 this.cardMisMatch(card, this.cardToCheck);


                 this.cardToCheck = null;            

    }


    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('mached');
        card2.classList.add('mached');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
        this.victory();

    }  
    
     removeCard(cards) {
    var card = document.getElementById(cards); 
    card.style.opacity = 0; 
    card.onclick = null; 
}

    cardMisMatch(card1, card2) {
            this.busy = true;
            setTimeout(() => {
              card1.classList.remove('visible');
              card2.classList.remove('visible');  
                this.busy = false;

            }, 1000);
    }



    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }


    shuffleCards() { // Fisher-Yates Shuffle Algorithm.
       
        let i = this.cardsArray.length;
        while (--i) {
           let j = Math.floor(Math.random() * (i+1 ));
            this.cardsArray[j].style.order = i ;
            this.cardsArray[i].style.order = j;
        }
    }

    
    
    canFlipCard(card) {

        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Games(150, cards);


    overlays.forEach(overlays => {
        overlays.addEventListener('click', () => {
            overlays.classList.remove('visible');
            game.startGame();
                 
        });
     });
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                game.flipCard(card);
            });
        });
    
}




