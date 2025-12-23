// LA Rams Tic Tac Toe Game Logic
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'ram'; // 'ram' or 'football'
let gameActive = true;
let scores = {
    ram: 0,
    football: 0,
    tie: 0
};

const RAM = '🐏';
const FOOTBALL = '🏈';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function makeMove(index) {
    if (!gameActive || board[index] !== '') {
        return;
    }

    const cell = document.querySelectorAll('.cell')[index];

    if (currentPlayer === 'ram') {
        board[index] = 'ram';
        cell.textContent = RAM;
        cell.classList.add('taken');
    } else {
        board[index] = 'football';
        cell.textContent = FOOTBALL;
        cell.classList.add('taken');
    }

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningCombo = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            winningCombo = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        const winner = currentPlayer === 'ram' ? 'Ram' : 'Football';
        const icon = currentPlayer === 'ram' ? RAM : FOOTBALL;
        document.getElementById('status').textContent = `${winner} Wins! ${icon}`;
        document.getElementById('status').className = currentPlayer === 'ram' ? 'status-message rams-blue' : 'status-message rams-yellow';

        // Highlight winning cells
        const cells = document.querySelectorAll('.cell');
        winningCombo.forEach(index => {
            cells[index].classList.add('winner');
        });

        // Update scores
        scores[currentPlayer]++;
        updateScoreDisplay();
        return;
    }

    // Check for tie
    if (!board.includes('')) {
        gameActive = false;
        document.getElementById('status').textContent = "It's a Tie! 🤝";
        document.getElementById('status').className = 'status-message text-gray-600';
        scores.tie++;
        updateScoreDisplay();
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'ram' ? 'football' : 'ram';
    const nextIcon = currentPlayer === 'ram' ? RAM : FOOTBALL;
    const nextPlayer = currentPlayer === 'ram' ? 'Ram' : 'Football';
    document.getElementById('status').textContent = `${nextPlayer}'s Turn ${nextIcon}`;
    document.getElementById('status').className = currentPlayer === 'ram' ? 'status-message rams-blue' : 'status-message rams-yellow';
}

function updateScoreDisplay() {
    document.getElementById('ram-score').textContent = scores.ram;
    document.getElementById('football-score').textContent = scores.football;
    document.getElementById('tie-score').textContent = scores.tie;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'ram';
    gameActive = true;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winner');
    });

    document.getElementById('status').textContent = `Ram's Turn ${RAM}`;
    document.getElementById('status').className = 'status-message rams-blue';
}

function resetScores() {
    scores = {
        ram: 0,
        football: 0,
        tie: 0
    };
    updateScoreDisplay();
    resetGame();
}

// Load scores from localStorage on page load
window.addEventListener('load', () => {
    const savedScores = localStorage.getItem('ramsTicTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
});

// Save scores to localStorage when they change
function updateScoreDisplay() {
    document.getElementById('ram-score').textContent = scores.ram;
    document.getElementById('football-score').textContent = scores.football;
    document.getElementById('tie-score').textContent = scores.tie;
    localStorage.setItem('ramsTicTacToeScores', JSON.stringify(scores));
}
