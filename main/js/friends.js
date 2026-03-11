(() => {
  const grid = document.getElementById("friends-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".friend-card"));

  const offline = cards.filter(c => (c.dataset.status || "").toLowerCase() === "offline");
  const active  = cards.filter(c => (c.dataset.status || "").toLowerCase() !== "offline");

 
  for (let i = active.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [active[i], active[j]] = [active[j], active[i]];
  }

 
  grid.innerHTML = "";
  [...active, ...offline].forEach(card => grid.appendChild(card));
})();