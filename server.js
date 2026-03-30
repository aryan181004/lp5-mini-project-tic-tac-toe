const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = {}; // stores id -> 'X' or 'O'
let board = Array(9).fill(null);
let currentPlayer = 'X';

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Assign symbols to the first two players
    if (Object.keys(players).length === 0) {
        players[socket.id] = 'X';
        socket.emit('player-assignment', 'X');
    } else if (Object.keys(players).length === 1) {
        players[socket.id] = 'O';
        socket.emit('player-assignment', 'O');
    } else {
        socket.emit('player-assignment', 'Spectator');
    }

    // Send the current game state to the newcomer
    socket.emit('update-board', board);
    socket.emit('update-turn', currentPlayer);

    socket.on('make-move', (index) => {
        const symbol = players[socket.id];
        
        // Validation
        if (!symbol || symbol === 'Spectator') return;
        if (symbol !== currentPlayer) return;
        if (board[index] !== null) return;

        // Perform move
        board[index] = symbol;
        
        const winningData = calculateWinner(board);
        const isDraw = board.every(cell => cell !== null) && !winningData;

        if (winningData) {
            io.emit('game-over', { winner: winningData.winner, indices: winningData.indices, board });
            resetGame();
        } else if (isDraw) {
            io.emit('game-over', { winner: 'Draw', board });
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            io.emit('update-board', board);
            io.emit('update-turn', currentPlayer);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete players[socket.id];
        // If a player disconnects, we should probably reset the game or handle it
        if (Object.keys(players).length < 2) {
            resetGame();
            io.emit('game-reset', 'A player disconnected. Resetting game.');
        }
    });
});

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], indices: [a, b, c] };
        }
    }
    return null;
}

function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    // We keep existing players symbols unless we want to shuffle them.
    // For now, let's just reset the board state.
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
