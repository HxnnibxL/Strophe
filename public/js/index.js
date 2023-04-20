// Get Xlsx quotes
let res = null;
fetch("/data", {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
}).then((response) => (res = response.json()));
const phraseContainer = document.getElementById("phrase-container");
const phraseText = document.getElementById("phrase");
const phraseAuthor = document.getElementById("auteur");

document.addEventListener("keydown", async function (event) {
  const phrases = await res;
  if (event.code === "Space") {
    const index = Math.floor(Math.random() * phrases.length);
    const phrase = phrases[index];
    phraseText.textContent = phrase.Phrase;
    phraseAuthor.textContent = phrase.Auteur;
  }
});

// Intro disappearing 
document.addEventListener("keydown", function(event) {
  if (event.code === "Space") {
    var phrase1 = document.getElementById("intro");
    var phrase2 = document.getElementById("phrase-container");
    if (phrase1.style.display !== "none") {
      phrase1.style.display = "none";
      phrase1.disabled = true;
      phrase2.style.display = "block";
    } else {
      phrase1.style.display = "none";
      phrase1.disabled = true;
      phrase2.style.display = "block";
    }
  }
});

// Mobile touch screen
document.addEventListener("touchstart", function(){
  genererPhrase();
});


// Animation Intro
var text = "Pour générer des citations, appuyez sur la touche espace.";
function typeWriter(text, i, fnCallback) {
  if (i < text.length) {
    document.getElementById("intro").innerHTML += text.charAt(i);
    i++;
    setTimeout(function() {
      typeWriter(text, i, fnCallback)
    }, 50);
  } else if (typeof fnCallback == 'function') {
    setTimeout(fnCallback, 1000);
  }
}
typeWriter(text, 0, function() {
  console.log("Dactylographie terminée !");
});


const logo = document.querySelector('.logo');

logo.addEventListener('animationend', () => {
  logo.style.animation = 'none';
  logo.style.top = '0';
  // logo.style.transform = 'translateX(-50%)';
});
