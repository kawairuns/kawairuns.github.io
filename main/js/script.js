const quotes = [
  "Signal lost at 03:17.",
  "Transmission unstable.",
  "Background noise increasing.",
  "Something responded.",
  "Origin unknown."
];

document.addEventListener("DOMContentLoaded", () => {
  const quoteElement = document.querySelector(".quote");
  if (quoteElement) {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = `"${random}"`;
  }
});


document.addEventListener("DOMContentLoaded", () => {

  const opsPanel = document.querySelector(".mobile-ops");
  if (!opsPanel) return;

  const output = document.getElementById("ops-output");
  const title = document.getElementById("ops-title");
  const viewer = opsPanel.querySelector(".ops-viewer");
  const closeBtn = document.getElementById("ops-close");

  let streaming = false;
  let currentLog = null;
  let streamTimer = null;

  const mobileLogs = {
    personal: `Operator profile:
• Name: adam
• Clearance: Level 4
• Assignment: Remote Monitoring
• Notes: Extended isolation.`,

    hobbies: `Hobbies:
- coding
- woodworking
- speedrunning
- messing with UI`,

    setup: `Current setup:
- Arch Linux
- Hyprland
- Firefox
- VSCode`,

    status: `Status:
All systems nominal.
No anomalies detected.`
  };

function streamText(text) {

  if (streaming) return;

  streaming = true;
  output.textContent = "";

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  function next() {

    if (i >= lines.length) {
      streaming = false;
      streamTimer = null;
      return;
    }

    const line = lines[i];

  
    output.textContent += (line.trim() ? `>> ${line}` : "") + "\n";

    i++;
    streamTimer = setTimeout(next, 20 + Math.random() * 60);
  }

  next();
}
  opsPanel.querySelectorAll(".ops-btn").forEach(btn => {

    btn.addEventListener("click", () => {

      const key = btn.dataset.log;

      if (streaming) return;
      if (currentLog === key) return;

      const text = mobileLogs[key];
      if (!text) return;

      currentLog = key;

      viewer.classList.add("open");
      title.textContent = `log.${key}`;

      streamText(text);
    });

  });

  closeBtn?.addEventListener("click", () => {

    viewer.classList.remove("open");
    title.textContent = "Awaiting selection";

    output.textContent = "";

    currentLog = null;
    streaming = false;

    if (streamTimer) {
      clearTimeout(streamTimer);
      streamTimer = null;
    }

  });

});

const operatorLogs = [
  "Maintaining remote systems. Awaiting anomalies.",
  "Atmospheric interference within acceptable range.",
  "Background noise remains stable.",
  "Passive monitoring cycle in progress.",
  "No unusual signal signatures detected.",
  "Dish array calibration completed.",
  "Minor interference detected in lower bands.",
  "System integrity holding."
];

if (Math.random() < 0.05) {
  entry = "Unidentified signal pattern detected briefly.",
"Transient noise spike recorded. Cause unknown.",
"Signal reflection detected. Origin unclear.";
}

const logElement = document.getElementById("operator-log");

function rotateOperatorLog() {
  if (!logElement) return;

  const entry = operatorLogs[Math.floor(Math.random() * operatorLogs.length)];
  logElement.textContent = entry;
}

setInterval(rotateOperatorLog, 35000);