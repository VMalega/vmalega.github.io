var allPersons = {
  count: 0,
  swapiKeyCount: 'count',
  goodIndexCollection: [],
  badIndexCollection: [],
  addCount(obj) {
    this.count = obj[this.swapiKeyCount];
  },
  tryToAddGoodIndex(index) {
    if (this.goodIndexCollection.indexOf(index) === -1) {
      this.goodIndexCollection.push(index);
      this.goodIndexCollection.sort((x,y)=>x-y);
      return true;
    } else {
      return false;
    }
  },
  tryToAddBadIndex(index) {
    if (this.badIndexCollection.indexOf(index) === -1) {
      this.badIndexCollection.push(index);
      return true;
    } else {
      return false;
    }
  }


}
var currPerson = {
  index: 0,
  getCounter: 0,
  heroKeys: [],
  previousGoodIndex:0,
  films:[],
  addHeroKey(swapiKey, title) {
    this.heroKeys.push({
      swapiKey: swapiKey,
      title: title
    });
  },
  removeHeroKey(swapiKey) {
    this.heroKeys = this.heroKeys.filter(item => item.swapiKey != swapiKey);
  },
  filmKeys: {
    title: 'Episode',
    swapiKeyEpisode: 'episode_id',
    swapiKeyTitle: 'title'
  },
  urlSwapiPart: 'https://swapi.co/api/people/',
  urlSwapi() {
    return this.urlSwapiPart + this.index + '/';
  },
  src(exists) {
    if (exists) {
      return 'img\\' + this.name + '.jpg';
    } else {
      return 'img\\' + 'noImage.jpg';
    }
  },
  copyHeroProperties(obj) {
    for (item of this.heroKeys) {
      if (obj.hasOwnProperty(item.swapiKey)) {
        this[item.swapiKey] = obj[item.swapiKey];
      }else {
        this[item.swapiKey]='no data';
      }

    }
    this.filmsUrls = obj.films;
  },
  forward() {
    this.index++;
  },
  backward() {
    this.index--;
  }
}
currPerson.addHeroKey('name', 'Name');
currPerson.addHeroKey('height', 'Height');
currPerson.addHeroKey('mass', 'Mass');
currPerson.addHeroKey('hair_color', 'Hair Color');
currPerson.addHeroKey('skin_color', 'Skin Color');
currPerson.addHeroKey('eye_color', 'Eye Color');
currPerson.addHeroKey('birth_year', 'Birth Year');
currPerson.addHeroKey('gender', 'Gender');

currPerson.addHeroKey('smth_new','Something New');


var htmlElements = {
  heroPic: document.getElementById('mainImg'),
  prevButton: document.getElementById('prevButton'),
  nextButton: document.getElementById('nextButton'),
  bioDataList: document.getElementById('bioDataList'),
  filmsList: document.getElementById('filmsList'),
  updCover: document.getElementById('updCover'),
  unableMsg: document.getElementById('unableMsg'),
  errMsg: document.getElementById('errMsg'),
  indexInfo:document.getElementById('indexInfo'),
  indexInput:document.getElementById('indexInput'),
  showByIndexButton:document.getElementById('showByIndexButton'),
  waitIcon:document.getElementById('waitIcon'),
}

function addCountToAllPersons(obj) {
  allPersons.count = obj[allPersons.swapiKeyCount];
  buttonClick(1);
}

function addFilm(obj) {
  let film='';
  film=film+currPerson.filmKeys.title+' ';
  film=film+obj[currPerson.filmKeys.swapiKeyEpisode] + ': ';
  film=film+obj[currPerson.filmKeys.swapiKeyTitle];
  currPerson.films.push(film);
  if (currPerson.getCounter === 0) {
    let liFilm;
    currPerson.films.sort().forEach(function(item){
      liFilm = document.createElement('li');
      liFilm.innerHTML = item;
      htmlElements.filmsList.appendChild(liFilm);
    });
    htmlElements.updCover.style = 'display:none';
    currPerson.previousGoodIndex=currPerson.index;
    allPersons.tryToAddGoodIndex(currPerson.index);
    if (currPerson.index === 1) {
      htmlElements.prevButton.disabled = true;
      htmlElements.prevButton.style='opacity:0.5';
    }else {
      htmlElements.prevButton.disabled = false;
      htmlElements.prevButton.style='opacity:1';
    }
    if (allPersons.count === allPersons.goodIndexCollection.length && allPersons.goodIndexCollection[allPersons.goodIndexCollection.length-1]===currPerson.index) {
      htmlElements.nextButton.disabled = true;
      htmlElements.nextButton.style='opacity:0.5';
    }else {
      htmlElements.nextButton.disabled = false;
      htmlElements.nextButton.style='opacity:1';
    }
  }
}

function fillNewHero(obj) {
  currPerson.copyHeroProperties(obj);
  let liBiometrics;
  htmlElements.bioDataList.innerHTML = '';
  htmlElements.filmsList.innerHTML = '';
  currPerson.films=[];
  for (item of currPerson.heroKeys) {
    liBiometrics = document.createElement('li');
    liBiometrics.innerHTML = item.title + ': ' + currPerson[item.swapiKey];
    htmlElements.bioDataList.appendChild(liBiometrics);
  }
  htmlElements.heroPic.src = currPerson.src(true);
  htmlElements.heroPic.onerror = () => {
    htmlElements.heroPic.src = currPerson.src(false);
  };
  for (variable of currPerson.filmsUrls) {
    getData(variable, addFilm, errCatcher);
  }
}

function errCatcher(err) {
  switch (err) {
    case 1:
    htmlElements.waitIcon.style='display: none';

    if (currPerson.previousGoodIndex===0) {
      htmlElements.errMsg.innerHTML='Unable to get heroes quantity from swapi.co';
    } else {
      htmlElements.errMsg.innerHTML='Unable to get data from swapi.co by index '+currPerson.index+'<br>I\'m going back to previous Hero' ;
      setTimeout(function() {
        unableMsg.style = 'display:none';
        htmlElements.waitIcon.style='display: block';
        currPerson.getCounter = 0;
        allPersons.tryToAddBadIndex(currPerson.index);
        currPerson.index=currPerson.previousGoodIndex;
        getData(currPerson.urlSwapi(), fillNewHero, errCatcher);
      }, 3000);
    }
    unableMsg.style = 'display:block';





      break;
      case 2:
        htmlElements.waitIcon.style='display: none';
        htmlElements.errMsg.innerHTML='Somthing goes wrong. Try to refresh the page.';
        unableMsg.style = 'display:block';
        htmlElements.showByIndexButton.disabled=true;
        break;
    default:

  }
}

function getData(url, callback, errCallback) {
  htmlElements.indexInfo.innerHTML='index: '+currPerson.index;
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      let res = request.responseText;
      currPerson.getCounter--;
      callback(JSON.parse(res));
    } else {
      if (request.readyState === 4 && request.status === 404) {
        errCallback(1);
      }else {
        if (request.readyState === 4) {
          errCallback(2);
        }
      }
    }
  };
  request.send();
  currPerson.getCounter++;
}

function buttonClick(index) {
  currPerson.getCounter = 0;
  htmlElements.updCover.style = 'display: block';
  htmlElements.waitIcon.style='display: block';
  switch (index) {
    case 0:
    currPerson.backward();
      while(allPersons.badIndexCollection.indexOf(currPerson.index)!=-1){
        currPerson.backward();
      }
      break;

    case 1:
      currPerson.forward();
      while(allPersons.badIndexCollection.indexOf(currPerson.index)!=-1){
        currPerson.forward();
      }
      break;
  }
  getData(currPerson.urlSwapi(), fillNewHero, errCatcher);
}
htmlElements.nextButton.onclick = function() {
  buttonClick(1);
}
htmlElements.prevButton.onclick = function() {
    buttonClick(0);
}
htmlElements.showByIndexButton.onclick=function(){
  let index=+htmlElements.indexInput.value;
  currPerson.index=index-1;
  buttonClick(1);
  if (allPersons.badIndexCollection.indexOf(index)!=-1) {
    alert('We tried index '+ index +' alredy.\n I\'ll try to show you next one which we didn\'t try before' );
  }
}

window.onload = ()=>{
  getData(currPerson.urlSwapiPart, addCountToAllPersons,errCatcher);
}
