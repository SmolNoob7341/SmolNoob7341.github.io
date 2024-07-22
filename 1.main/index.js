const homePage = document.getElementById('homePage');
const balloonPoppingGameButton = document.getElementById("balloonPoppingGameButton");
const quizGameButton = document.getElementById("quizGameButton");
const backToMenuButtons = document.getElementsByClassName("backToMenuButton");

const balloonPoppingGame = document.getElementById("balloonPoppingGame");
const quizGame = document.getElementById("quizGame");

let settingButton = document.getElementById("settingsButton");
let settingScreen = document.getElementById('materialSettingsScreen');
let homeBackButton = document.getElementById("homeBackButton");

function getScreen(type){  
  let setting = 'none'; let home = 'none';
  if(type == 'settings'){
    setting = 'block';
  }
  else if(type == 'home'){
    home = 'block';
  }
  document.getElementById('homePageScreen').style.display = home;
  settingScreen.style.display = setting;
}

getScreen("home");

settingButton.addEventListener("click", () => {
  getScreen("settings");
});

homeBackButton.addEventListener("click", () => {
  getScreen("home");
})  

balloonPoppingGameButton.addEventListener("click", function() {
  removeClass(homePage);
  addClass(balloonPoppingGame);
});

quizGameButton.addEventListener("click", function() {
  removeClass(homePage);
  addClass(quizGame);
});

for(let i = 0; i < backToMenuButtons.length; i++) {
  backToMenuButtons[i].addEventListener("click", function() {
    addClass(homePage);
    removeClass(balloonPoppingGame);
    removeClass(quizGame);
  });
}

function addClass(element){
  element.classList.add("active");
  element.classList.remove("inactive");
}

function removeClass(element){
  element.classList.add("inactive");
  element.classList.remove("active");
}
