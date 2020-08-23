let board = new Array();
let score = 0;
let hasConflicted = new Array();

let startx = 0;
let starty = 0;
let endx = 0;
let endy = 0;

$(document).ready(function () {
  prepareForMobile();
  newgame();
});

/*document.addEventListener("DOMContentLoaded",ready(function (){
  prepareForMobile();
  newgame();
}));*/

function prepareForMobile() {
  if (documentWidth > 500) {
    gridContainerWidth = 500;
    cellSpace = 20;
    cellSideLength = 100;
  }
  //document.getElementById("grid-container").style
  $("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
  $("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
  $("#grid-container").css("padding", cellSpace);
  $("#grid-container").css("boarder-radius", 0.02 * gridContainerWidth);
  //document.getElementsByClassName("grid-cell").style
  $(".grid-cell").css("width", cellSideLength);
  $(".grid-cell").css("height", cellSideLength);
  $(".grid-cell").css("border-radius", 0.02 * cellSideLength);

  
}

function newgame() {
  init();
  generateOneNumber();
  generateOneNumber();
}

function init() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let gridCell = $("#grid-cell-" + i + "-" + j);
      gridCell.css("top", getPosTop(i, j));
      gridCell.css("left", getPosLeft(i, j));
    }
  }

  for (let i = 0; i < 4; i++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for (let j = 0; j < 4; j++) {
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }
  updateBoardView();
  score = 0;
}

function updateBoardView() {
  $(".number-cell").remove();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      $("#grid-container").append(
        '<div class="number-cell" id="number-cell-' + i + "-" + j + '"></div>'
      );
      let theNumberCell = $("#number-cell-" + i + "-" + j);

      if (board[i][j] == 0) {
        theNumberCell.css("width", "0px");
        theNumberCell.css("height", "0px");
        theNumberCell.css("top", getPosTop(i, j) + cellSideLength / 2);
        theNumberCell.css("left", getPosLeft(i, j) + cellSideLength / 2);
      } else {
        theNumberCell.css("width", cellSideLength);
        theNumberCell.css("height", cellSideLength);
        theNumberCell.css("top", getPosTop(i, j));
        theNumberCell.css("left", getPosLeft(i, j));
        theNumberCell.css(
          "background-color",
          getNumberBackgroundColor(board[i][j])
        );
        theNumberCell.css("color", getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
      hasConflicted[i][j] = false;
    }
  }
  $(".number-cell").css("line-height", cellSideLength + "px");
  $(".number-cell").css("font-size", 0.6 * cellSideLength + "px");
}

function generateOneNumber() {
  if (nospace(board)) {
    return false;
  }

  //randomly generate a position
  let randx = parseInt(Math.floor(Math.random() * 4));
  let randy = parseInt(Math.floor(Math.random() * 4));
  let times = 0;
  while (times < 50) {
    if (board[randx][randy] == 0) {
      break;
    }
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
    times++;
  }

  if (times == 50) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          randx = i;
          randy = j;
        }
      }
    }
  }

  //randomly generate a number
  let randNumber = Math.random() < 0.5 ? 2 : 4;

  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);

  return true;
}

$(document).keydown(function (event) {
  event.preventDefault();
  switch (event.keyCode) {
    //left
    case 37:
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    //up
    case 38:
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    //right
    case 39:
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    //down
    case 40:
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    default:
      break;
  }
});

document.addEventListener("touchstart", function (event) {
  startx = event.touches[0].pageX;
  starty = event.touches[0].pageY;
});
document.addEventListener("touchend", function (event) {
  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;

  let deltax = endx - startx;
  let deltay = endy - starty;

  if (
    Math.abs(deltax) < 0.3 * documentWidth &&
    Math.abs(deltay) < 0.3 * documentWidth
  )
    return;
  if (Math.abs(deltax) > Math.abs(deltay)) {
    if (deltax > 0) {
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  } else {
    if (deltay > 0) {
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
});

function isgameover() {
  if (nospace(board) && nomove(board)) {
    gameover();
  }
}

function gameover() {
  alert("Gameover!");
}

function moveLeft() {
  if (!canMoveLeft(board)) return false;
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (let k = 0; k < j; k++) {
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[i][k] == board[i][j] &&
            noBlockHorizontal(i, k, j, board) &&
            hasConflicted[i][k] == false
          ) {
            showMoveAnimation(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp() {
  if (!canMoveUp(board)) return false;
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (let k = 0; k < i; k++) {
          if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[k][j] == board[i][j] &&
            noBlockVertical(k, i, j, board) &&
            hasConflicted[k][j] == false
          ) {
            showMoveAnimation(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveRight() {
  if (!canMoveRight(board)) return false;
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (let k = 3; k > j; k--) {
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[i][k] == board[i][j] &&
            noBlockHorizontal(i, j, k, board) &&
            hasConflicted[i][k] == false
          ) {
            showMoveAnimation(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown() {
  if (!canMoveDown(board)) return false;
  for (let i = 2; i >= 0; i--) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (let k = 3; k > i; k--) {
          if (board[k][j] == 0 && noBlockVertical(i, k, j, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[k][j] == board[i][j] &&
            noBlockVertical(i, k, j, board) &&
            hasConflicted[k][j] == false
          ) {
            showMoveAnimation(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}
