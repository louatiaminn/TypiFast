document.addEventListener("DOMContentLoaded", function() {
    const inputArea = document.getElementById('inputArea');
    const restartButton = document.getElementById('restartButton');
    const quoteText = document.getElementById('quoteText');
    const timerDisplay = document.querySelector('.curr_time');

    let timer;
    let timeLeft = 60;
    let totalTyped = 0;
    let correctTyped = 0;
    let isPlaying = false;

    const quotes = [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "The early bird catches the worm."
    ];

    function startGame() {
        if (isPlaying) return;

        isPlaying = true;
        resetGame();
        startTimer();
        quoteText.innerText = getRandomQuote();
        inputArea.focus();
    }

    function resetGame() {
        clearInterval(timer);
        timeLeft = 60;
        totalTyped = 0;
        correctTyped = 0;
        isPlaying = false;
        inputArea.value = '';
        timerDisplay.innerText = timeLeft;
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft === 0) {
                clearInterval(timer);
                isPlaying = false;
                saveGame();
            }
        }, 1000);
    }

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function calculateWPM() {
        return Math.round((totalTyped / 5) / ((60 - timeLeft) / 60));
    }

    function calculateAccuracy() {
        return Math.round((correctTyped / totalTyped) * 100);
    }

    function saveGame() {
        const gameData = {
            wpm: calculateWPM(),
            accuracy: calculateAccuracy()
        };

        fetch('/jeu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.log('Success:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    inputArea.addEventListener('input', function() {
        const quote = quoteText.innerText;
        const input = inputArea.value;

        totalTyped++;

        if (quote.startsWith(input)) {
            correctTyped++;
        }

        if (input === quote) {
            clearInterval(timer);
            isPlaying = false;
            saveGame();
        }
    });

    restartButton.addEventListener('click', startGame);

    startGame();
});
