const boardSize = 10; // Oyun tahtası boyutu (10x10)
const mineCount = 15; // Mayın sayısı
const board = document.getElementById('board');
const message = document.getElementById('message');
let cells = [];
let mines = [];
let revealedCount = 0;

// Oyun tahtasını oluştur
function createBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
    placeMines();
}

// Mayınları yerleştir
function placeMines() {
    mines = [];
    while (mines.length < mineCount) {
        const randomIndex = Math.floor(Math.random() * boardSize * boardSize);
        if (!mines.includes(randomIndex)) {
            mines.push(randomIndex);
        }
    }
}

// Hücreye tıklandığında
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);

    if (mines.includes(index)) {
        // Mayına tıklandı
        cell.classList.add('mine');
        revealAllMines();
        message.textContent = "Kaybettiniz!";
        disableClicks();
    } else {
        // Güvenli hücreye tıklandı
        revealCell(index);
        checkWin();
    }
}

// Hücreyi aç
function revealCell(index) {
    const cell = cells[index];
    if (cell.classList.contains('revealed')) return;

    cell.classList.add('revealed');
    revealedCount++;

    const mineCountAround = countMinesAround(index);
    if (mineCountAround > 0) {
        cell.textContent = mineCountAround;
    } else {
        // Etrafta mayın yoksa komşu hücreleri aç
        const neighbors = getNeighbors(index);
        neighbors.forEach(neighbor => revealCell(neighbor));
    }
}

// Etraftaki mayınları say
function countMinesAround(index) {
    const neighbors = getNeighbors(index);
    return neighbors.filter(neighbor => mines.includes(neighbor)).length;
}

// Komşu hücreleri bul
function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
                const neighborIndex = i * boardSize + j;
                if (neighborIndex !== index) {
                    neighbors.push(neighborIndex);
                }
            }
        }
    }
    return neighbors;
}

// Tüm mayınları göster
function revealAllMines() {
    mines.forEach(mineIndex => {
        cells[mineIndex].classList.add('mine');
    });
}

// Tıklamaları devre dışı bırak
function disableClicks() {
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}

// Kazanma durumunu kontrol et
function checkWin() {
    if (revealedCount === boardSize * boardSize - mineCount) {
        message.textContent = "Tebrikler, kazandınız!";
        disableClicks();
    }
}

// Oyunu başlat
createBoard();
