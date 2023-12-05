let seconds = 0;
let milliseconds = 0;
let numberOfMoves = 0;
let timerInterval;
let isArrowKeyReleased = true;
let initialUserIndex;

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
    numberOfMoves++;
    document.getElementById('moves').textContent = numberOfMoves;
}

// Function to move the user in a specific direction
function moveUser(direction) {
    // Get the current user position
    var userCell = $('.maze-large-cell.user');
    var userIndex = userCell.index();

    // Save the initial user index on the first move
    if (initialUserIndex === undefined) {
        initialUserIndex = userIndex;
    }

    // Get the number of columns in the grid
    var numCols = 81;

    // Calculate the number of rows in the grid
    var numRows = 81;

    // Calculate the new position based on the direction
    var newUserIndex;

    if (direction === 'up' && userIndex - numCols >= 0) {
        newUserIndex = userIndex - numCols;
    } else if (direction === 'down' && userIndex + numCols < $('.maze-large-cell').length) {
        newUserIndex = userIndex + numCols;
    } else if (direction === 'left' && userIndex % numCols !== 0) {
        newUserIndex = userIndex - 1;
    } else if (direction === 'right' && (userIndex + 1) % numCols !== 0) {
        newUserIndex = userIndex + 1;
    } else {
        // Invalid move
        return;
    }

    // Check if the new position is valid (not a wall)
    var newCell = $('.maze-large-cell').eq(newUserIndex);
    if (newCell.hasClass('path') || newCell.hasClass('user')) {
        // Move the user by swapping classes
        userCell.removeClass('user');
        newCell.addClass('user');

        // Check if the user position has changed
        if (initialUserIndex !== newUserIndex) {
            // Update the moves counter
            updateMovesCounter();
            // Update the initial user index
            initialUserIndex = newUserIndex;
        }
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
    }
});

// Event listener for arrow key press and WASD
$(document).keydown(function (event) {
    var direction;

    // Map arrow keys to directions
    if (event.key.startsWith('Arrow')) {
        direction = event.key.slice(5).toLowerCase();
    }

    // Map WASD keys to directions
    if (event.key.toLowerCase() === 'w') {
        direction = 'up';
    } else if (event.key.toLowerCase() === 's') {
        direction = 'down';
    } else if (event.key.toLowerCase() === 'a') {
        direction = 'left';
    } else if (event.key.toLowerCase() === 'd') {
        direction = 'right';
    }

    // Move the user
    if (direction) {
        moveUser(direction);
    }
});

// Event listener for arrow key release
$(document).keyup(function (event) {
    // Check if an arrow key is released
    if (event.key.startsWith('Arrow')) {
        // Set the flag to true to indicate that the key is released
        isArrowKeyReleased = true;
    }
});
