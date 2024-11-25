let moveSpeed = 3;
let gravity = 0.5;
let birdElement = document.querySelector('.bird');
let birdImage = document.getElementById('bird-1');
let pointSound = new Audio('sounds effect/point.mp3');
let deathSound = new Audio('sounds effect/die.mp3');
let called = false;
let isHighScore = false;
// Obtain bird element properties
let birdBounds = birdElement.getBoundingClientRect();
let backgroundBounds = document.querySelector('.background').getBoundingClientRect();

let scoreValue = document.querySelector('.score_val');
let messageElement = document.querySelector('.message');
let scoreTitle = document.querySelector('.score_title');
let leaderboardElement = document.querySelector('.leaderboard');

let gameState = 'Start';
birdImage.style.display = 'none';
messageElement.classList.add('messageStyle');
leaderboardElement.classList.add('leaderboard');

// Event listener to start the game when 'Enter' is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gameState !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((pipe) => pipe.remove());
        birdImage.style.display = 'block';
        birdElement.style.top = '40vh';
        gameState = 'Play';
        messageElement.innerHTML = '';
        scoreTitle.innerHTML = 'Score: ';
        scoreValue.innerHTML = '0';
        messageElement.classList.remove('messageStyle');
        leaderboardElement.style.display = 'none';
        startGame();
    }
});

function startGame() {
    leaderboardElement.classList.remove('leaderboard');

    function movePipes() {
        if (gameState !== 'Play') return;

        let pipes = document.querySelectorAll('.pipe_sprite');
        pipes.forEach((pipe) => {
            let pipeBounds = pipe.getBoundingClientRect();
            birdBounds = birdElement.getBoundingClientRect();

            if (pipeBounds.right <= 0) {
                pipe.remove();
            } else {
                if (
                    birdBounds.left < pipeBounds.left + pipeBounds.width &&
                    birdBounds.left + birdBounds.width > pipeBounds.left &&
                    birdBounds.top < pipeBounds.top + pipeBounds.height &&
                    birdBounds.top + birdBounds.height > pipeBounds.top
                ) {
                    endGame();
                } else {
                    if (pipeBounds.right < birdBounds.left && pipeBounds.right + moveSpeed >= birdBounds.left && pipe.increaseScore === '1') {
                        scoreValue.innerHTML = +scoreValue.innerHTML + 1;
                        pointSound.play();
                    }
                    pipe.style.left = pipeBounds.left - moveSpeed + 'px';
                }
            }
        });
        requestAnimationFrame(movePipes);
    }
    requestAnimationFrame(movePipes);

    let birdVelocity = 0;
    function applyGravity() {
        if (gameState !== 'Play') return;
        birdVelocity += gravity;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                birdImage.src = 'images/Bird-2.png';
                birdVelocity = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                birdImage.src = 'images/Bird.png';
            }
        });

        if (birdBounds.top <= 0 || birdBounds.bottom >= backgroundBounds.bottom) {
            endGame(true);
        }

        birdElement.style.top = birdBounds.top + birdVelocity + 'px';
        birdBounds = birdElement.getBoundingClientRect();
        requestAnimationFrame(applyGravity);
    }
    requestAnimationFrame(applyGravity);

    let pipeDistance = 0;
    let pipeGap = 35;

    function spawnPipe() {
        if (gameState !== 'Play') return;

        if (pipeDistance > 115) {
            pipeDistance = 0;

            let pipePosition = Math.floor(Math.random() * 43) + 8;
            let upperPipe = document.createElement('div');
            upperPipe.className = 'pipe_sprite';
            upperPipe.style.top = pipePosition - 70 + 'vh';
            upperPipe.style.left = '100vw';

            document.body.appendChild(upperPipe);

            let lowerPipe = document.createElement('div');
            lowerPipe.className = 'pipe_sprite';
            lowerPipe.style.top = pipePosition + pipeGap + 'vh';
            lowerPipe.style.left = '100vw';
            lowerPipe.increaseScore = '1';

            document.body.appendChild(lowerPipe);
        }
        pipeDistance++;
        requestAnimationFrame(spawnPipe);
    }
    requestAnimationFrame(spawnPipe);
}

// Initialize high score
if (!localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', '0');
}
document.querySelector('.score_title').innerHTML = `High Score: ${localStorage.getItem('highScore')}`;

// Simple high score update logic
function checkHighScore() {
    let currentScore = parseInt(scoreValue.innerHTML);
    let highScore = parseInt(localStorage.getItem('highScore'));
    if (currentScore > highScore) {
        localStorage.setItem('highScore', currentScore);
        isHighScore = true;
    }
}

// Added function to send score to server
function sendScore(playerName, score) {
    fetch('save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `player_name=${playerName}&score=${score}`
    }).then(response => response.text())
      .then(data => console.log(data));
}

function endGame(reload = false) {
    gameState = 'End';
    birdImage.style.display = 'none';
    deathSound.play();

    // Check for high score
    checkHighScore();
    // Handle high score submission
    if (isHighScore) {
        {
            if (confirm('You have a high score! Do you want to submit it to the leaderboard?')) {
                let playerName = prompt('Enter your name:');
                if (playerName) {
                    let score = scoreValue.innerHTML;
                    sendScore(playerName, score);
                    alert('Your score has been posted!');
                }
            }
            isHighScore = false; // Reset high score flag
        } // Slight delay to ensure UI update is visible
    }

    // Display the "Game Over" screen
    messageElement.innerHTML = '<h1>Game Over!<br><div>Press Enter to Restart</h1>'.fontcolor('red');
    messageElement.classList.add('messageStyle');

   

    // Optionally reload the game after displaying the "Game Over" screen
    if (reload) {
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Delay reload to give time for the UI to show
    }
}




