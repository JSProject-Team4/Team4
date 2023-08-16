// 게임컨테이너 가져오기
const gameContainer = document.getElementById('game-container');
gameContainer.tabIndex = 0;
// 행과 열의 크기
const rows = 20;
const columns = 10;



// ======================================================//


// 블록 만들기
const blockShapes = [
    [
        [1, 1],
        [1, 1]
    ],
    // [
    //     [1, 1, 1, 1]
    // ],
    // [
    //     [1],
    //     [1],
    //     [1, 1]
    // ],
    // [
    //     [1],
    //     [1],
    //     [1],
    //     [1]
    // ],
    // [
    //     [1, 1],
    //     [0, 1],
    //     [0, 1]
    // ]
];

// 블록 시작위치
let currentBlock = getRandomBlock();
let currentRow = 0; 
let currentCol = Math.floor(columns / 2) - 1;

let blockStopped = false;


// 게임판 만들기
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameContainer.appendChild(cell);
    }
}


// 게임판에 블록을 나타내는 함수
function displayBlock() {

    console.log('Displaying block');
    for (let row = 0; row < currentBlock.length; row++) {
        for (let col = 0; col < currentBlock[row].length; col++) {
            if (currentBlock[row][col] === 1) {
                const cellIndex = (currentRow + row) * columns + (currentCol + col);
                const cell = gameContainer.children[cellIndex];
                cell.style.backgroundColor = 'blue';
            }
        }
    }
}

// 블록의 원래위치를 지우는 함수 (이동했을때!)
function clearBlock() {

    console.log('Clearing block');
    for (let row = 0; row < currentBlock.length; row++) {
        for (let col = 0; col < currentBlock[row].length; col++) {
            if (currentBlock[row][col] === 1) {
                const cellIndex = (currentRow + row) * columns + (currentCol + col);
                const cell = gameContainer.children[cellIndex];
                cell.style.backgroundColor = '';
            }
        }
    }
}

// 블럭이 점점 아래로 내리는 함수
function moveBlockDown() {
    if (!blockStopped) {
        const completedRow = checkCompleteLines();
        if (completedRow !== -1) {
            removeAndMoveLines(completedRow);
        }
        
        clearBlock();
        if (canMoveBlockDown()) {
            currentRow++;
        } else {
            blockStopped = true;
        }
        
        displayBlock();
    }
}


// 블럭이 움직일 수 있는 상황인지 체크하는 함수
function canMoveBlockDown() {
    for (let row = currentBlock.length - 1; row >= 0; row--) {
        for (let col = 0; col < currentBlock[row].length; col++) {
            if (currentBlock[row][col] === 1) {
                const nextRow = currentRow + row + 1;
                const cellIndex = nextRow * columns + (currentCol + col);
                const cell = gameContainer.children[cellIndex];
                if (!cell || cell.style.backgroundColor === 'blue') {
                    return false;
                }
            }
        }
    }
    return true;
}


// 새로운 블록을 만든다
function createNewBlock() {
    currentBlock = getRandomBlock();
    currentRow = 0;
    currentCol = Math.floor(columns / 2) - 1;
    blockStopped = false;
}

// 만들어놓은 블록들 중에서 랜덤으로 1개를 가져오는 함수
function getRandomBlock() {
    const randomIndex = Math.floor(Math.random() * blockShapes.length);
    return blockShapes[randomIndex];
}


// 키보드 조작 이벤트리스너
gameContainer.addEventListener('keydown', (event) => {
    if (!blockStopped) {
        switch (event.key) {
            case 'ArrowLeft':
                console.log('left');
                moveBlockLeft();
                break;
            case 'ArrowRight':
                console.log('right'); // 확인용 로그
                moveBlockRight();
                break;
            case 'ArrowDown':
                console.log('down'); // 확인용 로그
                moveBlockDown();
                break;
        }
    }
});


// 좌우 이동가능?
function canMoveBlockHorizontally(direction) {
    for (let row = 0; row < currentBlock.length; row++) {
        for (let col = 0; col < currentBlock[row].length; col++) {
            if (currentBlock[row][col] === 1) {
                const nextCol = currentCol + (direction === 'left' ? col - 1 : col + 1);
                if (nextCol < 0 || nextCol >= columns) {
                    return false;
                }
                const cellIndex = (currentRow + row) * columns + nextCol;
                const cell = gameContainer.children[cellIndex];
                // if (cell.style.backgroundColor === 'blue') {
                //     return false;
                // }
            }
        }
    }
    return true;
}

// 좌로밀착
function moveBlockLeft() {
    if (canMoveBlockHorizontally('left')) {
        clearBlock();
        currentCol--;
        displayBlock();
    }
}

// 우로밀착
function moveBlockRight() {
    if (canMoveBlockHorizontally('right')) {
        clearBlock();
        currentCol++;
        displayBlock();
    }
}

// 한줄이 다 완성되었는가?
function checkCompleteLines() {
    let completedRows = [];
    for (let row = rows - 1; row >= 0; row--) {
        let isComplete = true;
        for (let col = 0; col < columns; col++) {
            const cellIndex = row * columns + col;
            const cell = gameContainer.children[cellIndex];
            if (cell.style.backgroundColor !== 'blue') {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            completedRows.push(row);
        }
    }
    return completedRows;
}
// 완성된 한줄을 삭제하고 위 블록을 아래로 내려라
function removeAndMoveLines(completedRows) {
    for (let i = completedRows.length - 1; i >= 0; i--) {
        const completedRow = completedRows[i];

        // 삭제할 줄의 위 블록들을 아래로 내리기
        for (let row = completedRow; row > 0; row--) {
            for (let col = 0; col < columns; col++) {
                const cellIndex = row * columns + col;
                const aboveCellIndex = (row - 1) * columns + col;
                const cell = gameContainer.children[cellIndex];
                const aboveCell = gameContainer.children[aboveCellIndex];
                cell.style.backgroundColor = aboveCell.style.backgroundColor;
            }
        }

        // 맨 위 줄은 빈 줄로 채움
        for (let col = 0; col < columns; col++) {
            const cellIndex = 0 * columns + col;
            const cell = gameContainer.children[cellIndex];
            cell.style.backgroundColor = '';
        }
    }
}














// 지속적으로 블럭을 아래로
const intervalTime = 1000; 
setInterval(() => {
    moveBlockDown();
    if (blockStopped) {
        createNewBlock();
    }
}, intervalTime);