let seconds = 0;
let milliseconds = 0;
let numberOfMoves = 0;
let timerInterval;
let isArrowKeyReleased = true;

// Function to update the timer
function updateTimer() {
    milliseconds += 10; // Increment by 100 milliseconds

    if (milliseconds >= 1000) {
        seconds++;
        milliseconds = 0;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    const formattedMilliseconds = milliseconds < 10 ? `00${milliseconds}` : milliseconds < 100 ? `0${milliseconds}` : milliseconds.toString().slice(0, 3);

    document.getElementById('timer').textContent = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}



// Function to update the moves counter
function updateMovesCounter() {
    // Check if an arrow key is currently pressed and has been released since the last press
    if (isArrowKeyReleased) {
        numberOfMoves++;
        document.getElementById('moves').textContent = numberOfMoves;

        // Set the flag to false to indicate that the key is pressed
        isArrowKeyReleased = false;
    }
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(updateTimer, 10); // Update every 1000 milliseconds (1 second)
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = undefined;
    isArrowKeyReleased = true; // Reset the flag when stopping the timer
}

// Event listener for arrow key press
document.addEventListener('keydown', function (event) {
    // Check if an arrow key is pressed
    if (event.key.startsWith('Arrow')) {
        // Start the timer if it hasn't started yet
        if (!timerInterval) {
            startTimer();
        }

        // Update the moves counter
        updateMovesCounter();
    }
});

// Event listener for arrow key release
document.addEventListener('keyup', function (event) {
    // Check if an arrow key is released
    if (event.key.startsWith('Arrow')) {
        // Set the flag to true to indicate that the key is released
        isArrowKeyReleased = true;
    }
});
