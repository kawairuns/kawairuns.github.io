const audio = document.getElementById("ambient-audio");
const toggle = document.getElementById("audio-toggle");

let playing = false;
let fadeInterval;

toggle.addEventListener("click", () => {
    if (!playing) {
        audio.volume = 0;
        audio.play();

        let vol = 0;
        fadeInterval = setInterval(() => {
            if (vol < 0.25) {
                vol += 0.01;
                audio.volume = vol;
            } else {
                clearInterval(fadeInterval);
            }
        }, 200);

        toggle.textContent = "SOUND: ON";
        playing = true;
    } else {
        audio.pause();
        toggle.textContent = "SOUND: OFF";
        playing = false;
    }
});


function randomGlitch() {
    const chance = Math.random();

    if (chance < 0.02) { 
        document.body.classList.add("glitch");

        setTimeout(() => {
            document.body.classList.remove("glitch");
        }, 120);
    }
}



function randomAnomaly() {
    let chance = 0.002;

if (signalLevel === 2) chance = 0.01;
if (signalLevel === 1) chance = 0.05;

if (Math.random() < chance) {
    triggerAnomaly();
}
}

let anomalyActive = false;

function triggerAnomaly() {
    if (anomalyActive) return;

    anomalyActive = true;
    document.body.classList.add("anomaly-mode");
    document.body.classList.add("chromatic");

    if (typeof window.addLog === "function") {
  addLog("!! CRITICAL SIGNAL INSTABILITY");
  addLog(">> Packet loss exceeding threshold");
  addLog(">> Source signature: UNKNOWN");
}

    corruptDossier();
    startTerminalDistortion();
if (audio && playing) {
  audio.volume = 0;
}

setTimeout(() => {
  if (audio && playing) {
    audio.volume = 0.25;
  }
}, 4000);

    setTimeout(() => {

  if (window.addLog) {
    addLog(">> Signal attempting re-alignment...");
    addLog(">> Phase drift normalising...");
  }

  document.body.classList.add("stabilising");

  setTimeout(() => {

    anomalyActive = false;

    if (window.addLog) {
      addLog(">> Signal stabilised.");
    }

    document.body.classList.remove("anomaly-mode", "chromatic", "stabilising");

    stopTerminalDistortion();
    restoreDossier();
    updateSignal(false);

  }, 4000);

}, 15000);
}

let distortionInterval;

function startTerminalDistortion() {
  const terminal = document.querySelector(".terminal-console");

  distortionInterval = setInterval(() => {
    if (!anomalyActive) return;

    const x = (Math.random() - 0.5) * 6;
    const y = (Math.random() - 0.5) * 6;

    terminal.style.transform = `translate(${x}px, ${y}px)`;

    if (Math.random() < 0.3) {
      addLog(generateGlitchText("...signal corruption..."));
    }

  }, 120);
}
function stopTerminalDistortion() {
    clearInterval(distortionInterval);
    document.querySelector(".terminal-console").style.transform = "none";
}

function corruptDossier() {
    const fields = document.querySelectorAll(".terminal-section p");

    fields.forEach(field => {

        if (!field.dataset.original) {
            field.dataset.original = field.textContent;
        }

        field.textContent = generateGlitchText(field.dataset.original);
    });
}

function restoreDossier() {
    const fields = document.querySelectorAll(".terminal-section p");

    fields.forEach(field => {
        if (field.dataset.original) {
            field.textContent = field.dataset.original;
        }
    });
}

function startDossierCorruptionLoop() {
    const fields = document.querySelectorAll(".terminal-section p");

    distortionInterval = setInterval(() => {
        fields.forEach(field => {
            field.textContent = generateGlitchText(field.dataset.original);
        });
    }, 120);
}

function generateGlitchText(text) {
    const chars = "!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return text.split("").map(char => {
        if (Math.random() < 0.2) {
            return chars[Math.floor(Math.random() * chars.length)];
        }
        return char;
    }).join("");
}



   const signalBars = document.querySelectorAll(".signal-bars span");

let signalLevel = 3;
let previousSignalLevel = signalLevel;

function updateSignalPercent() {

  const percentEl = document.getElementById("signal-percent");
  if (!percentEl) return;

  const ranges = {
    1: [1, 19],
    2: [20, 39],
    3: [40, 59],
    4: [60, 79],
    5: [80, 100]
  };

  const [min, max] = ranges[signalLevel];

  const value = Math.floor(Math.random() * (max - min + 1)) + min;

  percentEl.textContent = value + "%";
}



function updateSignal() {
  const oldLevel = signalLevel;

  if (anomalyActive) {
    signalLevel = 1;
  } else {
    const roll = Math.random();

    if (signalLevel >= 4) {
      if (roll < 0.1) signalLevel -= 1;
    } 
    else if (signalLevel === 3) {
      if (roll < 0.5) signalLevel += 1;
      else if (roll < 0.7) signalLevel -= 1;
    }
    else if (signalLevel === 2) {
      if (roll < 0.7) signalLevel += 1;
      else if (roll < 0.9) signalLevel -= 1;
    }
    else if (signalLevel === 1) {
      if (roll < 0.85) signalLevel += 1;
    }
  }

  signalLevel = Math.max(1, Math.min(5, signalLevel));

  signalBars.forEach((bar, i) => {
    bar.classList.remove("active", "low");

    if (i < signalLevel) {
      bar.classList.add("active");
      if (signalLevel <= 2) {
        bar.classList.add("low");
      }
    }
  });

  if (signalLevel !== oldLevel) {
    updateSignalPercent();
  }
}

updateSignal();
updateSignalPercent();
setInterval(updateSignal, 4000);



const bg = document.querySelector(".background-layer");
const dossier = document.querySelector(".operator-terminal");


document.addEventListener("mousemove", (e) => {

  const x = (e.clientX / window.innerWidth - 0.5) * 4;
  const y = (e.clientY / window.innerHeight - 0.5) * 4;

  if (bg) {
    bg.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (dossier) {
    dossier.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
  }
});

setInterval(randomAnomaly, 6000);

setInterval(() => {
  if (anomalyActive) return;

  if (Math.random() < 0.1) {
    signalBars.forEach(bar => bar.classList.toggle("flicker"));
    setTimeout(() => {
      signalBars.forEach(bar => bar.classList.remove("flicker"));
    }, 150);
  }
}, 2000);