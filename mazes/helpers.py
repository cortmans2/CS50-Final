import random

def create_maze(size):
    size_dimensions = {
        'small': (31, 31),
        'medium': (65, 65),
        'large': (81, 81)
    }

    rows, cols = size_dimensions[size]
    maze = [['#' for _ in range(cols)] for _ in range(rows)]

    def recursive_backtracker(row, col):
        maze[row][col] = ' '

        directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]
        random.shuffle(directions)

        for dr, dc in directions:
            next_row, next_col = row + dr, col + dc
            if 0 < next_row < rows - 1 and 0 < next_col < cols - 1 and maze[next_row][next_col] == '#':
                maze[row + dr // 2][col + dc // 2] = ' '
                recursive_backtracker(next_row, next_col)

    # Introduce dead-ends with a certain probability
    if random.random() < 0.2:  # Adjust the probability as needed
        maze[row][col] = '#'

    start_row, start_col = 1, 1
    recursive_backtracker(start_row, start_col)

    # Set the exit point
    exit_row, exit_col = rows - 2, cols - 2
    maze[exit_row][exit_col] = 'X'

    # Set the starting point
    maze[1][1] = 'O'

    return maze
