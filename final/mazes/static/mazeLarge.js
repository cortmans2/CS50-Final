let seconds = 0;
let milliseconds = 0;
let numberOfMoves = 0;
let timerInterval; // increment timer
let isArrowKeyReleased = true; // checks if arrow key is still presed, prevents duplicate move counter ++
let initialUserIndex;
var gameEnded = false; // Variable to track whether the game has ended

// Function to update the timer
function updateTimer() {
    if (gameEnded){
        return;
    }
    console.log("Updating timer");
    milliseconds += 10; // Increment by 10 milliseconds

    if (milliseconds >= 1000) {
        seconds++;
        milliseconds = 0;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // formats time from timer
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    const formattedMilliseconds = milliseconds < 10 ? `00${milliseconds}` : milliseconds < 100 ? `0${milliseconds}` : milliseconds.toString().slice(0, 3);

    // sends to html page
    document.getElementById('timer').textContent = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

// function to update the moves counter
function updateMovesCounter() {
    numberOfMoves++;
    document.getElementById('moves').textContent = numberOfMoves; // send moves to html
}

// movement!
function moveUser(direction) {
    if (gameEnded) {
        return; // cant move if game over
    }

    var userCell = $('.maze-large-cell.user'); // determines thats user
    var userIndex = userCell.index(); // 

    if (initialUserIndex === undefined) {
        initialUserIndex = userIndex;
    }
    // sets size of grid for movement
    var numCols = 81;
    var numRows = 81;
    var newUserIndex;// where user div is going on the grid

    // movement
    if (direction === 'up' && userIndex - numCols >= 0) {
        newUserIndex = userIndex - numCols;
    } else if (direction === 'down' && userIndex + numCols < $('.maze-large-cell').length) {
        newUserIndex = userIndex + numCols;
    } else if (direction === 'left' && userIndex % numCols !== 0) {
        newUserIndex = userIndex - 1;
    } else if (direction === 'right' && (userIndex + 1) % numCols !== 0) {
        newUserIndex = userIndex + 1;
    } else {
        return;
    }

    var newCell = $('.maze-large-cell').eq(newUserIndex); // checks if new cell 

    // checks if the new position is the exit cell
    if (newCell.hasClass('exit')) {
        userCell.removeClass('user');
        userCell.addClass('user-trail');
        userCell.removeClass('exit');
        newCell.addClass('user');
        gameEnded = true; // ends the game
        stopTimer();
        isArrowKeyReleased = false;
        showPopup();
        var time = formattedTotalTime(seconds + milliseconds / 1000);
        // adds time to leaderboard
        $.post("/add_to_leaderboard", { maze_type: "large", time})
        .done(function (response) {
            console.log("Time added to leaderboard:", time);
        })
        .fail(function (error) {
            console.error("Failed to add time to leaderboard:", error);
        });
        return;
    }

    // for visual user div movement; for trail, deletes if backtracks
    if (newCell.hasClass('path') || newCell.hasClass('user')) {
        userCell.removeClass('user');
        userCell.addClass('user-trail');
        newCell.addClass('user');
        if (newCell.hasClass('user-trail'))
        {
            newCell.addClass('user');
            userCell.removeClass('user-trail');
        }

        // updates move counter for each time the user div moves; also deletes trail if backtracks
        if (initialUserIndex !== newUserIndex) {
            updateMovesCounter();
            if ($('.maze-large-cell').eq(newUserIndex).hasClass('user-trail')) {
                $('.maze-large-cell').eq(newUserIndex).removeClass('user-trail');
            }
            initialUserIndex = newUserIndex;
        }
    }
}

function showPopup() {
    // calculate total time in seconds
    var totalTime = seconds + milliseconds / 1000;

    // create div for the popup
    var popup = $('<div class="popup">');

    // produce popup with time and moves and buttons
    popup.html(`
    <p>Complete!
    <br>
    Your Time: ${formattedTotalTime(totalTime)}
    <br>
    Moves: ${numberOfMoves}
    </p>
    <br>
    <form action="/" method="get">
        <input type="submit" value="Main Menu">
    </form>`);

    // adds popup to html
    $('body').append(popup);

}

// format time
function formattedTotalTime(totalTime) {
    const minutes = Math.floor(totalTime / 60);
    const remainingSeconds = totalTime % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toFixed(3);
    return `${formattedMinutes}:${formattedSeconds}`;
}


// starts the timer
function startTimer() {
    console.log("Timer started");
    timerInterval = setInterval(updateTimer, 10);
}

// stops the timer
function stopTimer() {
    console.log("Timer stopped");
    clearInterval(timerInterval);
    timerInterval = undefined;
    isArrowKeyReleased = true;
}

// calls start timer if timer isnt started
document.addEventListener('keydown', function (event) {
    if (event.key.startsWith('Arrow')|| ['w', 'a', 's', 'd'].includes(event.key.toLowerCase())) {
        if (gameEnded){
            return; // if game is over, timer wont start even if theres no timerinterval
        }
        if (!timerInterval) {
            startTimer(); 
        }
    }
});

$(document).keydown(function (event) {
    var direction;
    // takes direction and maps it to w or arrow
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
        moveUser(direction); // actually moves the user
    }
});

// makes sure it doesnt duplicate
$(document).keyup(function (event) {
    if (event.key.startsWith('Arrow')) {
        isArrowKeyReleased = true;
    }
});
