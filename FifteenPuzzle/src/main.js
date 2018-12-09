function insAfter(newElement, refferenceElement) {
  refferenceElement.parentNode.insertBefore(newElement, refferenceElement.nextSibling);
}


var fifteenContainer = document.createElement('div');
fifteenContainer.setAttribute('id', 'fifteen-board');
fifteenContainer.setAttribute('style', 'height:400px; width:400px; border-style: double;');
insAfter(fifteenContainer, document.getElementById('fifteen-puzzle-title'));
var fifteenCellsDivsArray = [];
var imgArray = [];
var emptyCellPosition=[3,3];

for (var i = 0; i < 4; i++) {
  arr = new Array(4);
  for (var j = 0; j < 4; j++) {
    arr[j] = document.createElement('div');
    arr[j].setAttribute('id', i + '-' + j);
    arr[j].setAttribute('style', 'height:100px; width:100px; float:left');
    arr[j].onclick = function() {
      let currPosition = this.id.split('-').map(x => {return parseInt(x)});
      if (Math.abs(currPosition[0]-emptyCellPosition[0]) + Math.abs(currPosition[1]-emptyCellPosition[1]) === 1) {
        fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]].appendChild(this.firstChild);
        if (currPosition[0]===emptyCellPosition[0]) {
          if (currPosition[1]>emptyCellPosition[1]) {
            fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]].classList.add('animate-moving-right');
          }else {
            fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]].classList.add('animate-moving-left');

          }
        }else {
          if (currPosition[0]>emptyCellPosition[0]) {
            fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]].classList.add('animate-moving-top');
          } else {
            fifteenCellsDivsArray[emptyCellPosition[0]][emptyCellPosition[1]].classList.add('animate-moving-bottom');
          }
        }
        fifteenCellsDivsArray[currPosition[0]][currPosition[1]].innerHTML=null;
        this.classList=[];
        emptyCellPosition=currPosition.slice(0);
      }

    }
    fifteenContainer.appendChild(arr[j]);

  }
  fifteenCellsDivsArray.push(arr);
}

for (var i = 0; i < 15; i++) {
  imgArray.push(document.createElement('img'));
  imgArray[i].setAttribute('id', 'button-' + i);
  imgArray[i].setAttribute('style', 'height:100px;width:100px');
  imgArray[i].setAttribute('src', 'img/' + (i + 1) + '.png');
  fifteenCellsDivsArray[Math.floor(i / 4)][i % 4].appendChild(imgArray[i]);
}
