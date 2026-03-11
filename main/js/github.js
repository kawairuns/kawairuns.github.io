document.querySelectorAll(".github-card").forEach(card => {

  const repo = card.dataset.repo;
  const rawURL = card.dataset.raw;
  const previewLines = parseInt(card.dataset.lines || "80", 10);

  const toggleBtn = card.querySelector(".repo-toggle");
  const content = card.querySelector(".repo-content");
  const codeEl = card.querySelector(".repo-file code");

  const nameEl = card.querySelector(".repo-name");
  const descEl = card.querySelector(".repo-desc");
  const metaEl = card.querySelector(".repo-meta");

  let fileLoaded = false;

  fetch(`https://api.github.com/repos/${repo}`)
    .then(res => res.json())
    .then(data => {
      const repoLink = `https://github.com/${repo}`;

      nameEl.innerHTML = "";
      const a = document.createElement("a");
      a.href = repoLink;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = data.full_name;
      nameEl.appendChild(a);

      descEl.textContent = data.description || "No description provided.";

      metaEl.textContent =
        `★ ${data.stargazers_count} • ${data.language || "Unknown"} • Updated ${new Date(data.updated_at).toLocaleDateString()}`;
    })
    .catch(() => {
      nameEl.textContent = repo;
      metaEl.textContent = "Could not load repo metadata.";
    });

  toggleBtn.addEventListener("click", () => {

    const isOpen = content.classList.contains("open");

    if (isOpen) {
      content.classList.remove("open");
      toggleBtn.textContent = "[ + ] View File";
      return;
    }

    content.classList.add("open");
    toggleBtn.textContent = "[ − ] Hide File";

    if (fileLoaded) return;
    fileLoaded = true;

    fetch(rawURL)
      .then(res => res.text())
      .then(text => {
        const lines = text.replace(/\r\n/g, "\n").split("\n");
        const shown = lines.slice(0, previewLines);
        const remaining = Math.max(0, lines.length - previewLines);

        streamLines(shown, codeEl, () => {
          if (remaining > 0) {
            codeEl.textContent += `\n\n// … +${remaining} more lines (truncated)`;
          } else {
            codeEl.textContent += `\n\n// end of file`;
          }
        });
      })
      .catch(() => {
        codeEl.textContent = "// Failed to load file.";
      });

  });

});

function streamLines(lines, el, onDone) {
  let i = 0;

  function next() {
    if (i >= lines.length) {
      if (typeof onDone === "function") onDone();
      return;
    }

    el.textContent += lines[i] + "\n";
    i++;

    let delay = 6 + Math.random() * 14;
    if (Math.random() < 0.08) delay += 120 + Math.random() * 250;

    setTimeout(next, delay);
  }

  next();
}