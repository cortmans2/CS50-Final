$(document).ready(function () {
    // Function to move the user in a specific direction
    function moveUser(direction) {
        // Get the current user position
        var userCell = $('.maze-small-cell.user');
        var userIndex = userCell.index();

        // Get the number of columns in the grid
        var numCols = 31

        // Calculate the number of rows in the grid
        var numRows = 31

        // Calculate the new position based on the direction
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
            // Invalid move
            return;
        }

        // Check if the new position is valid (not a wall)
        var newCell = $('.maze-small-cell').eq(newUserIndex);
        if (newCell.hasClass('path') || newCell.hasClass('user')) {
            // Move the user by swapping classes
            userCell.removeClass('user');
            newCell.addClass('user');
        }
    }

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
});

