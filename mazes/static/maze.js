document.getElementById('mazeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var size = event.submitter.value;
    startGame(size);
});

function startGame(size) {
    window.location.href = `/maze?size=${size}`;
}

let seconds = 0;
let numberOfMoves = 0;
let timerInterval;

// Function to update the timer
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Function to update the moves counter
function updateMovesCounter() {
    numberOfMoves++;
    document.getElementById('moves').textContent = numberOfMoves;
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
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

        // Your existing logic for maze movements (replace this with your actual logic)
        handleMazeMovement(event.key);
    }
});

// Function to handle maze movement (replace this with your actual logic)
function handleMazeMovement(key) {
    // Your maze movement logic here
}

// Assuming you have a grid represented as a 2D array where '#' represents walls,
// 'O' represents the user, 'X' represents the exit, and ' ' represents paths.
const maze = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
    ['#', '#', '#', ' ', '#', ' ', '#', '#', '#', '#', '#', '#', '#', ' ', '#'],
    ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', ' ', '#', ' ', '#', '#', '#', '#'],
    ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', 'X', ' ', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
];

const userPosition = { row: 1, col: 1 }; // Initial position of the user

// Function to update the user's position and move the user div
function moveUser(direction) {
    const newRow = userPosition.row + (direction === 'ArrowDown' ? 1 : direction === 'ArrowUp' ? -1 : 0);
    const newCol = userPosition.col + (direction === 'ArrowRight' ? 1 : direction === 'ArrowLeft' ? -1 : 0);

    // Check if the new position is within the maze boundaries and is a valid path
    if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length && maze[newRow][newCol] === ' ') {
        // Move the user div to the new position
        const userDiv = document.querySelector('.user');
        userDiv.style.gridRow = newRow + 1; // Adjust for 1-based grid
        userDiv.style.gridColumn = newCol + 1; // Adjust for 1-based grid

        // Update the user's position
        userPosition.row = newRow;
        userPosition.col = newCol;
    }
}

// Event listener for arrow key press
document.addEventListener('keydown', function (event) {
    // Check if an arrow key is pressed
    if (event.key.startsWith('Arrow')) {
        // Update the user's position based on the arrow key
        moveUser(event.key);
    }
});
