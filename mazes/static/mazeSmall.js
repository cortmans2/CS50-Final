let seconds = 0;
let milliseconds = 0;
let numberOfMoves = 0;
let timerInterval;
let isArrowKeyReleased = true;
let initialUserIndex;
var exitCellClass = 'exit'; // Replace with the actual class name of the exit cell
var gameEnded = false; // Variable to track whether the game has ended

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
    if (gameEnded) {
        return; // Don't allow movement if the game has ended
    }

    var userCell = $('.maze-small-cell.user');
    var userIndex = userCell.index();

    if (initialUserIndex === undefined) {
        initialUserIndex = userIndex;
    }

    var numCols = 31;
    var numRows = 31;
    var newUserIndex;

    if (direction === 'up' && userIndex - numCols >= 0) {
        newUserIndex = userIndex - numCols;
    } else if (direction === 'down' && userIndex + numCols < $('.maze-small-cell').length) {
        newUserIndex = userIndex + numCols;
    } else if (direction === 'left' && userIndex % numCols !== 0) {
        newUserIndex = userIndex - 1;
    } else if (direction === 'right' && (userIndex + 1) % numCols !== 0) {
        newUserIndex = userIndex + 1;
    } else {
        return;
    }

    var newCell = $('.maze-small-cell').eq(newUserIndex);

    // Check if the new position is the exit cell
    if (newCell.hasClass(exitCellClass)) {
        stopTimer();
        isArrowKeyReleased = false;
        showPopup();
        gameEnded = true; // Set the gameEnded variable to true
        return;
    }

    if (newCell.hasClass('path') || newCell.hasClass('user')) {
        userCell.removeClass('user');
        newCell.addClass('user');

        if (initialUserIndex !== newUserIndex) {
            updateMovesCounter();
            initialUserIndex = newUserIndex;
        }
    }
}

function showPopup() {
    // Calculate the total time in seconds
    var totalTime = seconds + milliseconds / 1000;

    // Create a div for the popup
    var popup = $('<div class="popup">');

    // Add content to the popup (time and moves)
    popup.html(`<p>Complete!<br>Your Time: ${formattedTime(totalTime)}<br>Moves: ${numberOfMoves}</p>`);

    // Append the popup to the body
    $('body').append(popup);
}

// Function to format time
function formattedTime(totalTime) {
    const minutes = Math.floor(totalTime / 60);
    const remainingSeconds = totalTime % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toFixed(3);
    return `${formattedMinutes}:${formattedSeconds}`;
}


// Function to start the timer
function startTimer() {
    timerInterval = setInterval(updateTimer, 10);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = undefined;
    isArrowKeyReleased = true;
}

document.addEventListener('keydown', function (event) {
    if (event.key.startsWith('Arrow')) {
        if (!timerInterval) {
            startTimer();
        }
    }
});

$(document).keydown(function (event) {
    var direction;

    if (event.key.startsWith('Arrow')) {
        direction = event.key.slice(5).toLowerCase();
    }

    if (event.key.toLowerCase() === 'w') {
        direction = 'up';
    } else if (event.key.toLowerCase() === 's') {
        direction = 'down';
    } else if (event.key.toLowerCase() === 'a') {
        direction = 'left';
    } else if (event.key.toLowerCase() === 'd') {
        direction = 'right';
    }

    if (direction && isArrowKeyReleased) {
        moveUser(direction);
    }
});

$(document).keyup(function (event) {
    if (event.key.startsWith('Arrow')) {
        isArrowKeyReleased = true;
    }
});
