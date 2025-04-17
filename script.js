let currentPlayer = "X";
let boardSize = 4;
let turnsCounter = 0;

const getCellPlacement = (index, numberOfRows) => {
  const row = Math.floor(index / numberOfRows);
  const col = index % numberOfRows;

  return [row, col];
};

const createBoardArray = () => {
  let board = [];

  for (let row = 0; row < boardSize; row++) {
    board.push(Array.from({ length: boardSize }, () => "_"));
  }
  return board;
};

let board = createBoardArray();

const resetButton = document.querySelector("#reset");

const resetBoard = () => {
  document.querySelector(".board").remove();
  createBoard();
  board = createBoardArray();
  turnsCounter = 0;
  currentPlayer = "X";
};

const checkRows = () => {
  let columns = 0;

  for (let row = 0; row < boardSize; row++) {
    while (columns < boardSize) {
      if (board[row][columns] !== currentPlayer) {
        columns = 0;
        break;
      }
      columns++;
    }
    if (columns === boardSize) {
      return true;
    }
  }
};

const checkColumns = () => {
  let rows = 0;

  for (let column = 0; column < boardSize; column++) {
    while (rows < boardSize) {
      if (board[rows][column] !== currentPlayer) {
        rows = 0;
        break;
      }
      rows++;
    }
    if (rows === boardSize) {
      return true;
    }
  }
};

const checkDiagonals = () => {
  let count = 0;

  while (count < boardSize) {
    if (board[count][count] !== currentPlayer) {
      count = 0;
      break;
    }
    count++;
  }
  if (count === boardSize) {
    return true;
  }
};

const checkReverseDiagonals = () => {
  let count = 0;

  while (count < boardSize) {
    if (board[count][boardSize - count - 1] !== currentPlayer) {
      count = 0;
      break;
    }
    count++;
  }
  if (count === boardSize) {
    return true;
  }
};

const checkWin = (currentPlayer) => {
  if (checkRows(currentPlayer)) return true;
  if (checkColumns(currentPlayer)) return true;
  if (checkDiagonals(currentPlayer)) return true;
  if (checkReverseDiagonals(currentPlayer)) return true;
};

const runWinEvent = (currentPlayer) => {
  setTimeout(() => {
    alert(`Player ${currentPlayer} Won`);
    resetBoard();
  }, 100);
};

const runDrawEvent = () => {
  setTimeout(() => {
    alert("Draw!");
    resetBoard();
  }, 100);
};

const drawMarkInCell = (cell, currentPlayer) => {
  cell.querySelector(".value").textContent = currentPlayer;
  cell.classList.add(`cell--${currentPlayer}`);
};

const cellClickHandler = (event, index) => {
  const cell = event.target;
  const [row, col] = getCellPlacement(index, boardSize);

  if (board[row][col] === "_") {
    turnsCounter++;
    board[row][col] = currentPlayer;
    drawMarkInCell(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
      runWinEvent(currentPlayer);
    } else if (turnsCounter === boardSize ** 2) {
      runDrawEvent();
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
};

const createCell = (index) => {
  const cellElementString = `
    <div class = "cell" role = "button" tabindex ="${index + 1}">
    <span class = "value"></span>
    </div>
    `;
  const cellElement = document
    .createRange()
    .createContextualFragment(cellElementString);
  cellElement.querySelector(".cell").onclick = (event) =>
    cellClickHandler(event, index);
  cellElement.querySelector(".cell").onkeydown = (event) =>
    event.key === "Enter" ? cellClickHandler(event, index) : true;

  return cellElement;
};

const createBoard = () => {
  const container = document.querySelector(".container");
  const board = document.createElement("div");

  board.classList.add("board");
  for (let i = 0; i < boardSize ** 2; i++) {
    const cellElement = createCell(i);
    board.appendChild(cellElement);
  }
  document.documentElement.style.setProperty("--grid-rows", boardSize);
  container.insertAdjacentElement("afterbegin", board);
};

resetButton.addEventListener("click", resetBoard);

// ⬇️ Event listener for board size selector
const boardSizeSelector = document.getElementById("board-size-selector");

boardSizeSelector.addEventListener("change", (event) => {
  boardSize = parseInt(event.target.value);
  resetBoard();
});

createBoard();
