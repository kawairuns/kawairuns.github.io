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

document.addEventListener("DOMContentLoaded", () => {
  const friendCards = document.querySelectorAll(".friend-card");

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  friendCards.forEach(card => {
    const timeEl = card.querySelector(".last-contact");
    if (!timeEl) return;

    const hour = Math.floor(Math.random() * 24);
    const fixedMinute = card.dataset.fixedMinute;

    let minute;
    if (fixedMinute !== undefined) {
      minute = fixedMinute;
    } else {
      minute = pad(Math.floor(Math.random() * 60));
    }

    timeEl.textContent = `${pad(hour)}:${minute}`;
  });
});