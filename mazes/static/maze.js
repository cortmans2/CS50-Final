document.getElementById('mazeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var size = event.submitter.value;
    startGame(size);
});

function startGame(size) {
    window.location.href = `/maze?size=${size}`;
}