/* Projector mode controller — vanilla JS, framework-agnostic.
   Include after projector-mode.css. Activates via:
     • `P` keyboard shortcut
     • floating toggle button (top-right)
     • ?mode=projector in the URL
   Persists the choice in localStorage. */
(function () {
  const KEY = "trinity-sim-projector";
  const body = document.body;

  const urlMode = new URLSearchParams(window.location.search).get("mode");
  const stored = localStorage.getItem(KEY);
  const initial = urlMode === "projector" || stored === "on";
  setMode(initial);

  function setMode(on) {
    body.classList.toggle("projector", on);
    localStorage.setItem(KEY, on ? "on" : "off");
    const btn = document.querySelector(".projector-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function toggle() {
    setMode(!body.classList.contains("projector"));
  }

  window.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.key === "p" || event.key === "P") toggle();
  });

  function injectButton() {
    if (document.querySelector(".projector-toggle")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "projector-toggle";
    btn.setAttribute("aria-label", "Toggle projector mode (P)");
    btn.title = "Projector mode (P)";
    btn.setAttribute("aria-pressed", body.classList.contains("projector") ? "true" : "false");
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="15" height="10" rx="2"/><path d="M18 11h3v2h-3"/><path d="M7 21h8"/><path d="M9 17v4M15 17v4"/></svg>';
    btn.addEventListener("click", toggle);
    body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectButton);
  } else {
    injectButton();
  }
})();
