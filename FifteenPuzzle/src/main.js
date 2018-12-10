function insAfter(newElement, refferenceElement) {
  refferenceElement.parentNode.insertBefore(newElement, refferenceElement.nextSibling);
}

var fifteenContainer = document.createElement('div');
var stepsCounteText = document.getElementById('steps-counter');
var timeCounteText = document.getElementById('time-counter');
var buttonMixPazzle = document.getElementById('button-mix-puzzle');
var buttonWinPosition = document.getElementById('button-win-position');
fifteenContainer.setAttribute('id', 'fifteen-board');
fifteenContainer.setAttribute('style', 'height:400px; width:400px; border-style: double;');
insAfter(fifteenContainer, buttonMixPazzle);
var fifteenCellsDivsArray = [];
var imgArray = [];
var emptyCellPosition = [];
var gameState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const winState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var gameSteps = 0;
var gameTimer = [0, 0];
var runTimer = false;

for (let i = 0; i < 4; i++) {
  arr = new Array(4);
  for (let j = 0; j < 4; j++) {
    arr[j] = document.createElement('div');
    arr[j].setAttribute('id', i + '-' + j);
    arr[j].setAttribute('style', 'height:100px; width:100px; float:left');
    arr[j].onclick = function() {
      let currPosition = this.id.split('-').map(x => {
        return parseInt(x)
      });
      if (Math.abs(currPosition[0] - emptyCellPosition[0]) + Math.abs(currPosition[1] - emptyCellPosition[1]) === 1) {
        fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]].appendChild(this.firstChild);
        this.appendChild(imgArray[15]);
        gameState[emptyCellPosition[0] * 4 + emptyCellPosition[1]] = gameState[currPosition[0] * 4 + currPosition[1]];
        gameState[currPosition[0] * 4 + currPosition[1]] = 16;
        gameSteps++;
        stepsCounteText.innerHTML = 'Game steps: ' + gameSteps;
        try {
          localStorage.setItem('fifteenGameState', gameState);
        } catch (e) {
          console.log('unable to store game state in local storage');
        }
        if (currPosition[0] === emptyCellPosition[0]) {
          if (currPosition[1] > emptyCellPosition[1]) {
            animateElement(fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]], 'move-right', 0.2);
          } else {
            animateElement(fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]], 'move-left', 0.2);
          }
        } else {
          if (currPosition[0] > emptyCellPosition[0]) {
            animateElement(fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]], 'move-top', 0.2);
          } else {
            animateElement(fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]], 'move-bottom', 0.2);
          }
        }
        emptyCellPosition = currPosition.slice(0);
      } else {
        animateElement(fifteenCellsDivsArray[currPosition[0]][currPosition[1]], 'shake', 0.2);
      }


    }
    fifteenContainer.appendChild(arr[j]);

  }
  fifteenCellsDivsArray.push(arr);
}

for (let i = 0; i < 16; i++) {
  imgArray.push(document.createElement('img'));
  imgArray[i].setAttribute('id', (i + 1) + '-pad');
  imgArray[i].setAttribute('style', 'height:100px;width:100px');
  imgArray[i].setAttribute('src', 'img/' + (i + 1) + '.png');
}
try {
  if (localStorage.getItem('fifteenGameState') != null) {
    gameState = localStorage.getItem('fifteenGameState').split(',').map(x => {
      return parseInt(x)
    });
  } else {
    localStorage.setItem('fifteenGameState', gameState);
  }
} catch (e) {
  console.log('Unable to access local storge to save last game state');
}

fillPuzzle();

var timerId = setInterval(function() {
  if (runTimer) {
    gameTimer[1]++;
    if (gameTimer[1] > 59) {
      gameTimer[0]++;
      gameTimer[1] = 0;
    }
    timeCounteText.innerHTML = '0'.repeat(2 - gameTimer[0].toString().length) + gameTimer[0] + ':' + '0'.repeat(2 - gameTimer[1].toString().length) + gameTimer[1];
  }

}, 1000);

buttonMixPazzle.onclick = function() {
  mixPuzzle();
}

buttonWinPosition.onclick = function() {
  gameState = winState.slice(0);
  fillPuzzle();

}


function fillPuzzle() {
  for (let i = 0; i < 16; i++) {
    fifteenCellsDivsArray[Math.floor(i / 4)][i % 4].appendChild(imgArray[gameState[i] - 1]);
    if (gameState[i] === 16) {
      emptyCellPosition[0] = Math.floor(i / 4);
      emptyCellPosition[1] = Math.floor(i % 4);
    }
    try {
      localStorage.setItem('fifteenGameState', gameState);
    } catch (e) {
      console.log('unable to store game state in local storage');
    }
  }
  gameSteps = 0;
  stepsCounteText.innerHTML = 'Game steps: ' + gameSteps;
  gameTimer = [0, 0];
  timeCounteText.innerHTML = '00:00';
  runTimer = true;
}

function mixPuzzle() {
  gameState.sort((a, b) => Math.random() - 0.5);
  fillPuzzle();
}

function checkWin() {
  for (var i = 0; i < 16; i++) {
    if (winState[i] != gameState[i]) {
      return false;
    }
  }
  runTimer = false;
  return true;
}

function animateElement(obj, animationName, duration) {
  obj.style.animationName = animationName;
  obj.style.animationDuration = duration + 's';
  obj.style.animationIteration = '1';
  setTimeout(function() {
    obj.style.animationName = null;
    if (checkWin()) {
      alert('You won!');
    }
  }, duration * 1000);

}
