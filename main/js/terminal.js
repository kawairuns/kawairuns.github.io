
const log = document.getElementById("console-log");
const input = document.getElementById("console-input");
const ghost = document.getElementById("autocomplete-ghost");




let overrideActive = false;

const logs = {

    public: {

        personal: `Operator profile:
• Name: adam
• Clearance: Level 4
• Assignment: Remote Monitoring
• Notes: Extended isolation.`,

        hobbies: `Interests:
• Signal analysis
• Woodworking
• Speedrunning`,

        incident_03: `Incident 03:
Signal spike recorded at 02:24.
Source unidentified.
Duration: 42 seconds.`,

        facility: `Remote Signal Facility
Status: Operational
Location: Undisclosed`
    },

    hidden: {

        classified: `CLASSIFIED ENTRY:
Signal anomaly does not match known spectrum bands.
Cross-reference attempts failed.`,

        anomaly: `Anomaly Log:
Repeated low-frequency interference detected.
Signal origin appears recursive.
Operator exposure time increasing.`
    }
};



const commandTree = {
    help: null,
    clear: null,

    sv: {
        ping: null,
        status: null,
        override: null
    },

    // scan: {
    //     local: null,
    //     deep: null
    // },

    log: {
        list: null,
        personal: null,
        hobbies: null,
        incident_03: null,
        facility: null
    }
};



window.addLog = function(text, isCommand = false) {
    const line = document.createElement("div");
    if (isCommand) line.classList.add("command-line");
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
}

function streamLog(text, baseDelay = 25) {

    document.body.classList.add("streaming");

    const lines = text.split("\n");
    let index = 0;

    
    const initialDelay = 150 + Math.random() * 250;

    setTimeout(() => {

        function nextLine() {

            if (index >= lines.length) {
                return;
            }

            addLog(lines[index]);

            index++;

      
            let delay = baseDelay + Math.random() * 120;

         
            if (Math.random() < 0.15) {
                delay += 200 + Math.random() * 400;
            }

            setTimeout(nextLine, delay);
        }

        nextLine();

    }, initialDelay);
}

function corruptText(text) {

    const chars = "!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    return text.split("").map(c => {

        if (c === "\n") return c;

        if (Math.random() < 0.05) {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        return c;

    }).join("");
}


function handleCommand(raw) {

    const cmd = raw.trim();
    if (!cmd) return;

    addLog("");
    addLog(">>> " + cmd, true);

    if (cmd === "help") return showHelp();
    if (cmd === "clear") return log.innerHTML = "";

   if (cmd === "sv.override") {

    if (overrideActive) {
        addLog("Override already active.");
        return;
    }

    addLog("Attempting override...");

    setTimeout(() => {
        addLog("...");
    }, 700);

    setTimeout(() => {
        overrideActive = true;
        addLog("Override granted.");
        showCompletionMarker();
        document.body.classList.remove("streaming");
    }, 1600);

    return;
}

    if (cmd === "sv.ping") return addLog("Reply received.");
    if (cmd === "sv.status") {
    addLog("Server Status: ONLINE");
    addLog("Signal Stability: Nominal");
    addLog("Uptime: " + getUptime());
    return;
}

if (cmd === "log.list") {

    addLog("Available logs:");

    Object.keys(logs.public).forEach(name => {
        addLog("  log." + name);
    });

    if (overrideActive) {
        Object.keys(logs.hidden).forEach(name => {
            addLog("  log." + name);
        });
    }

    return;
}

if (cmd.startsWith("log.")) {

    const key = cmd.split(".")[1];

    if (logs.public[key]) {
        streamLog(logs.public[key]);
        return;
    }

    if (overrideActive && logs.hidden[key]) {
        const corrupted = corruptText(logs.hidden[key]);
streamLog(corrupted, 40);
        return;
    }

    addLog("Log entry not found.");
    return;
}

    addLog("Command not recognized.");
}




function showHelp() {
    addLog("CORE:");
    addLog("  help  clear");
    addLog("");

    addLog("NETWORK:");
    addLog("  sv.ping  sv.status  sv.override");
    // addLog("  scan.local  scan.deep");
    addLog("");

    addLog("LOGS:");
    addLog("  log.list  (view available entries)");

    
}



const facilityStartDate = new Date("2022-08-14T03:14:00");

function getUptime() {
    const now = new Date();
    const diff = now - facilityStartDate;

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days}d ${hours}h ${minutes}m`;
}





let commandHistory = [];
let historyIndex = -1;

let tabMatches = [];
let tabIndex = 0;
let tabBase = "";

function getSuggestions(text) {

    const trimmed = text.trim();
    return getCommandSuggestions(trimmed);
}

function getFileSuggestions(partial, base) {

    const dir = getDirectory(currentPath);
    if (!dir) return [];

    return Object.keys(dir.contents)
        .filter(name => name.startsWith(partial))
        .map(name => {
            const suffix = dir.contents[name].type === "dir" ? "/" : "";
            return base + " " + name + suffix;
        });
}

function getCommandSuggestions(text) {

    const parts = text.split(".");
    let level = commandTree;

    for (let i = 0; i < parts.length - 1; i++) {
        if (!level[parts[i]]) return [];
        level = level[parts[i]];
    }

    const last = parts[parts.length - 1];

    return Object.keys(level)
        .filter(key => key.startsWith(last))
        .map(key => {

            const hasChildren =
                typeof level[key] === "object" &&
                level[key] !== null;

            const base =
                parts.length > 1
                    ? parts.slice(0, -1).join(".") + "." + key
                    : key;

            return hasChildren ? base + "." : base;
        });
}

function updateGhost() {
    const suggestions = getSuggestions(input.value);
    ghost.textContent = suggestions.length ? suggestions[0] : "";
}

input.addEventListener("input", updateGhost);

input.addEventListener("keydown", (e) => {

    if (e.key === "Tab") {
    e.preventDefault();

 
    if (tabBase === "") {
        tabBase = input.value;
        tabMatches = getSuggestions(tabBase);
        tabIndex = 0;
    } else {
        tabIndex++;
    }

    if (tabMatches.length > 0) {
        input.value = tabMatches[tabIndex % tabMatches.length];
    }

    updateGhost();
    return;
}

    if (e.key === "Enter") {
        e.preventDefault();
        handleCommand(input.value);
        commandHistory.push(input.value);
        historyIndex = commandHistory.length;
        input.value = "";
        ghost.textContent = "";
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
            updateGhost();
        }
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = "";
        }
        updateGhost();
    }
    if (!["Tab", "Shift", "ArrowUp", "ArrowDown"].includes(e.key)) {
    tabMatches = [];
    tabIndex = 0;
    tabBase = "";
}
});