// THEME: handle light/dark mode
(function themeController() {
  const storageKey = 'theme';
  const root = document.documentElement;
  const toggle = () => {
    const current = getExplicitTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setExplicitTheme(next);
    updateButton();
  };

  function getExplicitTheme() {
    return localStorage.getItem(storageKey);
  }

  function clearExplicitTheme() {
    localStorage.removeItem(storageKey);
  }

  function setExplicitTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
      localStorage.setItem(storageKey, theme);
    }
  }

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyThemeFromPreference() {
    const explicit = getExplicitTheme();
    if (explicit === 'light' || explicit === 'dark') {
      root.setAttribute('data-theme', explicit);
    } else {
      root.removeAttribute('data-theme'); // fall back to CSS @media (system)
    }
  }

  function updateButton() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const explicit = getExplicitTheme();
    const effective = explicit || getSystemPreference();
    // Icon-only button: update icon via data attribute and accessibility labels
    button.textContent = '';
    button.setAttribute('data-icon', effective === 'dark' ? 'sun' : 'moon');
    button.setAttribute('title', effective === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    button.setAttribute('aria-label', effective === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    button.setAttribute('aria-pressed', effective === 'dark' ? 'true' : 'false');
  }

  function onSystemChange(e) {
    // Only react to system if user has no explicit choice
    if (!getExplicitTheme()) {
      applyThemeFromPreference();
      updateButton();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyThemeFromPreference();
    updateButton();
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggle);
      btn.addEventListener('contextmenu', (e) => {
        // Right-click to reset to system preference
        e.preventDefault();
        clearExplicitTheme();
        applyThemeFromPreference();
        updateButton();
      });
    }
    // Watch system preference changes
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onSystemChange);
    } catch (_) {
      // Safari <14 fallback
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addListener) mq.addListener(onSystemChange);
    }
  });
})();

// Get Xlsx quotes
async function fetchData() {
  try {
    const response = await fetch("/data", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return [];
  }
}

const phraseContainer = document.getElementById("phrase-container");
const phraseText = document.getElementById("phrase");
const phraseAuthor = document.getElementById("auteur");

let phrases = [];

document.addEventListener("DOMContentLoaded", async () => {
  phrases = await fetchData();
});

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && phrases.length > 0) {
    const index = Math.floor(Math.random() * phrases.length);
    const phrase = phrases[index];
    phraseText.textContent = phrase.Phrase;
    phraseAuthor.textContent = phrase.Auteur;
  }
});

// Gestionnaire d'événements pour les interactions mobiles
document.addEventListener("touchstart", function (event) {
  if (phrases.length > 0) {
    const index = Math.floor(Math.random() * phrases.length);
    const phrase = phrases[index];
    phraseText.textContent = phrase.Phrase;
    phraseAuthor.textContent = phrase.Auteur;
  }
});


// Intro disappearing 
function handleInteraction() {
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

// Gestion des interactions clavier
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    handleInteraction();
  }
});

// Gestion des interactions mobiles
document.addEventListener("touchstart", function (event) {
  handleInteraction();
});



// Animation Intro
function selectIntroText() {
  var screenWidth = window.innerWidth;
  var text;

  if (screenWidth > 924) {
    // Texte pour les écrans de plus de 924 pixels de large (ordinateurs)
    text = "Pour générer des citations, appuyez sur la touche espace.";
  } else {
    // Texte pour les écrans de moins de 924 pixels de large (téléphones)
    text = "Touchez l'écran pour générer des citations.";
  }

  return text;
}

var text = selectIntroText();

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

// Prevent same quote twice in a row
let lastIndex = -1;

function getRandomQuote() {
  let index;
  do {
    index = Math.floor(Math.random() * phrases.length);
  } while (index === lastIndex);
  lastIndex = index;
  return phrases[index];
}
