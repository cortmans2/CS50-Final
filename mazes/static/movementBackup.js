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

    // Event listener for arrow key press
    $(document).keydown(function (event) {
        if (event.key.startsWith('Arrow')) {
            // Map arrow keys to directions
            var direction;
            if (event.key === 'ArrowUp') {
                direction = 'up';
            } else if (event.key === 'ArrowDown') {
                direction = 'down';
            } else if (event.key === 'ArrowLeft') {
                direction = 'left';
            } else if (event.key === 'ArrowRight') {
                direction = 'right';
            }

            // Move the user
            moveUser(direction);
        }
    });
});
