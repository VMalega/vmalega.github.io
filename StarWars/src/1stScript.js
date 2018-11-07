// Object for current hero with property "props" - array which contains list of heroe's biometrics articles to display
//and appropriate properties of people on www.swapi.com
var currPerson = {
  index: 1,
  urlPart: 'https://swapi.co/api/people/',
  url() {
    return this.urlPart + this.index + '/';
  },
  src(exists) {
    if (exists) {
      return 'img\\' + this.props[0][2] + '.jpg';
    } else {
      return 'img\\' + 'noImage.jpg';
    }
  },
  //We can change biometric data to show according to swapi.co can give us or our demands
  // but all the biometric data should be placed before films item of props array
  props: [
    ['Name', 'name', ''],
    ['Height', 'height', ''],
    ['Mass', 'mass', ''],
    ['Hair Color', 'hair_color', ''],
    ['Skin Color', 'skin_color', ''],
    ['Eye Color', 'eye_color', ''],
    ['Birth Year', 'birth_year', ''],
    ['Gender', 'gender', ''],
    ['FilmsUrlList','films',[]]  //"Films" item of props array
  ],
  filmInfo:{
    prefix:'Episode',
    episodeKey:'episode_id',
    titleKey:'title'
  },

  addInfo(obj) {
    //iterates props array but not including last one "Films" item
    for (var i = 0; i < this.props.length-1; i++) {
      this.props[i][2] = obj[this.props[i][1]];
    }
    //fill the 3-d (array) item of "Films" by films urls from swapi.co
    this.props[this.props.length-1][2]=obj[this.props[this.props.length-1][1]];
  },
  forward() {
    this.index++;
  },
  backward() {
    this.index--;
  }
}
//Object of index.html tags
var htmlElements = {
  heroPic: document.getElementById('mainImg'),
  prevButton: document.getElementById('prevButton'),
  nextButton: document.getElementById('nextButton'),
  bioDataList: document.getElementById('bioDataList'),
  filmsList: document.getElementById('filmsList'),
}

function addFilm(obj){
  let liFilm=document.createElement('li');
  liFilm.innerHTML=currPerson.filmInfo.prefix+' '+obj[currPerson.filmInfo.episodeKey]+': '+obj[currPerson.filmInfo.titleKey];
  htmlElements.filmsList.appendChild(liFilm);
}

function fillNewHero(obj) {
  currPerson.addInfo(obj);
  let liBiometrics;
  htmlElements.bioDataList.innerHTML = '';
  htmlElements.filmsList.innerHTML = '';
  for (var i = 0; i < currPerson.props.length-1; i++) {
    liBiometrics = document.createElement('li');
    liBiometrics.innerHTML = currPerson.props[i][0] + ': ' + currPerson.props[i][2];
    htmlElements.bioDataList.appendChild(liBiometrics);
  }
  htmlElements.heroPic.src = currPerson.src(true);
  htmlElements.heroPic.onerror = () => {
    htmlElements.heroPic.src = currPerson.src(false);
  }
  for (var i = 0; i < currPerson.props[currPerson.props.length-1][2].length; i++) {
    // console.log(currPerson.props[currPerson.props.length-1][2][i]);
    getData(currPerson.props[currPerson.props.length-1][2][i],addFilm);
  }
}

function getData(url, callback) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      let res = request.responseText;
      // console.log(JSON.parse(res));
      callback(JSON.parse(res));
    }
  };
  request.send();
}



htmlElements.nextButton.onclick = function() {
  currPerson.forward();
  getData(currPerson.url(), fillNewHero);
}
htmlElements.prevButton.onclick = function() {
  if (currPerson.index>1) {
    currPerson.backward();
    getData(currPerson.url(), fillNewHero);
  }

}
getData(currPerson.url(), fillNewHero);
