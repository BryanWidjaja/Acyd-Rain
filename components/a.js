const gameSection = document.querySelector(".game");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
gameSection.appendChild(canvas);

const W = 30;
const H = 30;
const TILE_SIZE = 20;
const acidWidth = W;
const acidHeight = H;

let highscore = 0;
let level = 1;
let playerX = 0;
let playerY = 0;
let turns = 1;
let totalTurns = 0;
let currentScore = 0;
let totalCurrentScore = 0;
let currColor = "#000000";

const colors = [
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#e91e63",
  "#9c27b0",
  "#607d8b",
];

let acidBoard = Array.from({ length: acidHeight }, () =>
  Array(acidWidth).fill("#ffffff")
);

function getSymbolAmount(level) {
  if (level <= 3) return 3;
  if (level <= 6) return 4;
  if (level <= 9) return 5;
  return 6;
}

function getTurnAmount(level) {
  if (level <= 3) return Math.floor(Math.random() * 5) + 11;
  if (level <= 6) return Math.floor(Math.random() * 4) + 12;
  if (level <= 9) return Math.floor(Math.random() * 2) + 14;
  return Math.floor(Math.random() * 2) + 15;
}

function randomizeColor() {
  const possible = colors.slice(0, getSymbolAmount(level));
  let candidate;
  do {
    candidate = possible[Math.floor(Math.random() * possible.length)];
  } while (!acidBoard.flat().includes(candidate));
  currColor = candidate;
  updateInfo();
}

function fillAcid() {
  acidBoard = Array.from({ length: acidHeight }, () =>
    Array(acidWidth).fill("#ffffff")
  );
  const possible = colors.slice(0, getSymbolAmount(level));

  for (let itr = 0; itr < 10; itr++) {
    let x = Math.floor(Math.random() * (acidWidth - 4));
    let y = Math.floor(Math.random() * (acidHeight - 4));
    let size = Math.floor(Math.random() * 4) * 2 + 1;
    let color = possible[Math.floor(Math.random() * possible.length)];

    for (let i = y; i < y + size && i < acidHeight; i++) {
      for (let j = x; j < x + size && j < acidWidth; j++) {
        acidBoard[i][j] = color;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < acidHeight; y++) {
    for (let x = 0; x < acidWidth; x++) {
      ctx.fillStyle = acidBoard[y][x];
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  // Red border around the player tile
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    playerX * TILE_SIZE,
    playerY * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

function resizeCanvas() {
  canvas.width = 600;
  canvas.height = 600;
  canvas.style.width = "600px";
  canvas.style.height = "600px";
}

resizeCanvas();

window.addEventListener("resize", () => {
  resizeCanvas();
  draw();
});

function floodFill(x, y, target, replacement) {
  if (x < 0 || y < 0 || x >= acidWidth || y >= acidHeight) return;
  if (acidBoard[y][x] !== target || target === replacement) return;

  acidBoard[y][x] = replacement;
  currentScore++;

  floodFill(x + 1, y, target, replacement);
  floodFill(x - 1, y, target, replacement);
  floodFill(x, y + 1, target, replacement);
  floodFill(x, y - 1, target, replacement);
}

function checkUniform() {
  const first = acidBoard[0][0];
  return acidBoard.every((row) => row.every((cell) => cell === first));
}

function nextLevel() {
  level++;
  totalCurrentScore += currentScore;
  currentScore = 0;
  turns = 1;
  totalTurns = getTurnAmount(level);
  fillAcid();
  randomizeColor();
  playerX = 0;
  playerY = 0;
  updateInfo();
  draw();
}

function gameOver() {
  totalCurrentScore += currentScore;
  if (totalCurrentScore > highscore) highscore = totalCurrentScore;
  alert(`Game Over!\nScore: ${totalCurrentScore}\nHighscore: ${highscore}`);
  level = 1;
  totalCurrentScore = 0;
  initGame();
}

function initGame() {
  fillAcid();
  randomizeColor();
  currentScore = 0;
  totalCurrentScore = 0;
  playerX = 0;
  playerY = 0;
  turns = 1;
  totalTurns = getTurnAmount(level);
  updateInfo();
  draw();
}

document.addEventListener("keydown", (e) => {
  const prevX = playerX;
  const prevY = playerY;

  if (e.key === "w") playerY--;
  else if (e.key === "s") playerY++;
  else if (e.key === "a") playerX--;
  else if (e.key === "d") playerX++;
  else if (e.key === " ") {
    if (
      playerX >= 0 &&
      playerX < acidWidth &&
      playerY >= 0 &&
      playerY < acidHeight
    ) {
      if (acidBoard[playerY][playerX] !== currColor) {
        floodFill(playerX, playerY, acidBoard[playerY][playerX], currColor);
        randomizeColor();
        turns++;
        updateInfo();
        if (checkUniform()) nextLevel();
        else if (turns > totalTurns) gameOver();
      }
    }
  }

  if (playerX < 0 || playerX >= acidWidth) playerX = prevX;
  if (playerY < 0 || playerY >= acidHeight) playerY = prevY;

  draw();
});

function updateInfo() {
  const info = document.getElementById("info-container");
  info.innerHTML = `
    <div><strong>Level:</strong> ${level}</div>
    <div><strong>Turns:</strong> ${turns} / ${totalTurns}</div>
    <div><strong>Current Score:</strong> ${currentScore}</div>
    <div><strong>Total Score:</strong> ${totalCurrentScore}</div>
    <div><strong>Highscore:</strong> ${highscore}</div>
    <div><strong>Current Color:</strong> <span style="display:inline-block;width:20px;height:20px;background:${currColor};border:1px solid #000;"></span></div>
  `;
}

initGame();
