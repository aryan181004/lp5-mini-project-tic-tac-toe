const socket = io();

// UI Elements
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const playerRoleEl = document.getElementById('player-role');
const currentTurnEl = document.getElementById('current-turn');
const winnerBannerEl = document.getElementById('winner-banner');
const winnerTextEl = document.getElementById('winner-text');
const resetBtn = document.getElementById('reset-btn');

const strikeLineEl = document.getElementById('strike-line');

let playerSymbol = null;
let currentTurn = 'X';
let gameActive = true;

const winningLines = {
    '0,1,2': { top: '16.6%', left: '5%', width: '90%', rotation: '0deg' },
    '3,4,5': { top: '50%', left: '5%', width: '90%', rotation: '0deg' },
    '6,7,8': { top: '83.3%', left: '5%', width: '90%', rotation: '0deg' },
    '0,3,6': { top: '5%', left: '16.6%', width: '90%', rotation: '90deg' },
    '1,4,7': { top: '5%', left: '50%', width: '90%', rotation: '90deg' },
    '2,5,8': { top: '5%', left: '83.3%', width: '90%', rotation: '90deg' },
    '0,4,8': { top: '5%', left: '8%', width: '120%', rotation: '45deg' },
    '2,4,6': { top: '5%', left: '92%', width: '120%', rotation: '135deg' }
};

// Initialize Board Cells
function createBoard() {
    boardEl.innerHTML = '';
    // Re-add strike line because boardEl.innerHTML = '' clears it
    const line = document.createElement('div');
    line.id = 'strike-line';
    line.className = 'strike-line hidden';
    boardEl.appendChild(line);
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i, cell));
        boardEl.appendChild(cell);
    }
}

function handleCellClick(index, cell) {
    if (!gameActive) return;
    if (playerSymbol !== currentTurn) return;
    if (cell.textContent !== '') return;

    // Send move to server
    socket.emit('make-move', index);
}

// Socket Event Listeners
socket.on('connect', () => {
    statusEl.textContent = 'Connected to Server';
    statusEl.style.color = '#10b981'; // Green
});

socket.on('disconnect', () => {
    statusEl.textContent = 'Disconnected from Server';
    statusEl.style.color = '#ef4444'; // Red
});

socket.on('player-assignment', (symbol) => {
    playerSymbol = symbol;
    playerRoleEl.textContent = symbol === 'Spectator' ? 'You are: Spectator' : `You are: Player ${symbol}`;
});

socket.on('update-board', (board) => {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].textContent = val;
        cells[i].className = 'cell' + (val ? ` ${val.toLowerCase()} disabled` : '');
    });
});

socket.on('update-turn', (turn) => {
    currentTurn = turn;
    currentTurnEl.textContent = `Turn: ${turn}`;
    
    if (playerSymbol === turn) {
        statusEl.textContent = 'Your Turn!';
        statusEl.style.color = '#38bdf8';
    } else if (playerSymbol === 'Spectator') {
        statusEl.textContent = 'Watching Game';
        statusEl.style.color = '#94a3b8';
    } else {
        statusEl.textContent = "Waiting for Opponent...";
        statusEl.style.color = '#94a3b8';
    }
});

socket.on('game-over', ({ winner, indices, board }) => {
    gameActive = false;
    
    // Update final board state
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].textContent = val;
        cells[i].className = 'cell' + (val ? ` ${val.toLowerCase()} disabled` : ' disabled');
    });

    // Draw strike line
    if (indices) {
        const line = document.getElementById('strike-line');
        const key = indices.sort((a,b) => a-b).join(',');
        const style = winningLines[key];
        if (style) {
            line.style.top = style.top;
            line.style.left = style.left;
            line.style.width = style.width;
            line.style.transform = `rotate(${style.rotation})`;
            line.classList.remove('hidden');
        }
    }

    winnerBannerEl.classList.remove('hidden');
    if (winner === 'Draw') {
        winnerTextEl.textContent = "It's a Tie!";
    } else {
        winnerTextEl.textContent = `Winner: ${winner}!`;
        if (winner === playerSymbol) {
            statusEl.textContent = "You Won!";
            statusEl.style.color = '#10b981';
        } else if (playerSymbol !== 'Spectator') {
            statusEl.textContent = "You Lost!";
            statusEl.style.color = '#ef4444';
        }
    }
});

socket.on('game-reset', (message) => {
    gameActive = true;
    winnerBannerEl.classList.add('hidden');
    statusEl.textContent = message || 'Game Reset';
    createBoard();
});

resetBtn.addEventListener('click', () => {
    // In this basic version, anyone can trigger a board clear on the frontend 
    // but the server also resets internally. For now, let's just refresh.
    window.location.reload();
});

// Initial Setup
createBoard();
