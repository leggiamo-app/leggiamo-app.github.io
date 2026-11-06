const soundButtons = [...document.querySelectorAll("[data-audio]")];
const audioStatus = document.querySelector("#audio-status");
let activeAudio = null;

function stopAudio(message = "Tocca e ascolta: proprio come nell’app.") {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  for (const button of soundButtons) {
    button.disabled = false;
    button.classList.remove("is-playing");
    button.removeAttribute("aria-busy");
  }
  if (audioStatus) audioStatus.textContent = message;
}

for (const button of soundButtons) {
  button.addEventListener("click", async () => {
    if (activeAudio) return;
    const clip = new Audio(`assets/${button.dataset.audio}.mp3`);
    activeAudio = clip;
    for (const control of soundButtons) control.disabled = true;
    button.classList.add("is-playing");
    button.setAttribute("aria-busy", "true");
    audioStatus.textContent = "Ascolta…";
    const finish = (message) => {
      if (activeAudio === clip) stopAudio(message);
    };
    clip.addEventListener("ended", () => finish(), { once: true });
    clip.addEventListener("error", () => finish("L’audio non è disponibile. Riprova tra poco."), { once: true });
    try {
      await clip.play();
    } catch {
      finish("Non è stato possibile avviare l’audio. Tocca per riprovare.");
    }
  });
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAudio();
});
window.addEventListener("pagehide", () => stopAudio());

const worlds = {
  unicorn: [
    ["Ogni avventura comincia in piccolo.", "Un tenero unicorno, pronto a scoprire le sue prime lettere.", "#f5dedc"],
    ["Un mantello per nuove scoperte.", "Arriva un mantello dorato: la magia cresce, una parola alla volta.", "#dce8ca"],
    ["Una scintilla di magia.", "Una grande bacchetta stellata per festeggiare i nuovi traguardi.", "#e8ddf3"],
    ["La fantasia mette le ali.", "Spuntano due ali: ogni sillaba porta un po’ più lontano.", "#d9edf4"],
    ["Una conquista da incoronare.", "Una corona e nuovi dettagli rendono speciale questo piccolo amico.", "#f7e7b7"],
    ["Una festa da ricordare.", "Un abito da favola e un mondo pieno di arcobaleni: quanta strada insieme!", "#e0d7f3"],
  ],
  explorer: [
    ["Pronti per la prima missione.", "Un piccolo esploratore, con tutta la curiosità dell’universo.", "#dce9f3"],
    ["Si parte per le stelle.", "Una tuta colorata e uno zaino per le prossime avventure.", "#dce9dc"],
    ["Una bandiera, un traguardo.", "Ogni nuova parola è una piccola scoperta da festeggiare.", "#dcdff4"],
    ["Una spinta alla curiosità.", "Arrivano i propulsori: il viaggio continua verso nuove parole.", "#f5dfcf"],
    ["Un razzo tutto suo.", "Una nuova astronave per accompagnare il nostro esploratore.", "#e0ddf0"],
    ["Capitano di grandi scoperte.", "Un equipaggiamento speciale e una galassia di conquiste da celebrare.", "#d7dfed"],
  ],
};
const scene = document.querySelector(".evolution-scene");
const worldButtons = [...document.querySelectorAll("button[data-world]")];
const stageButtons = [...document.querySelectorAll("button[data-stage]")];
let world = "unicorn";
let stage = 1;

function updateScene() {
  if (!scene) return;
  const [title, description, color] = worlds[world][stage - 1];
  scene.dataset.world = world;
  scene.dataset.stage = stage;
  scene.style.backgroundColor = color;
  document.querySelector("#scene-level").textContent = `LIVELLO ${stage}`;
  document.querySelector("#scene-title").textContent = title;
  document.querySelector("#scene-description").textContent = description;
  const image = document.querySelector("#evolution-image");
  image.src = `assets/${world}-${stage}.webp`;
  image.alt = `${world === "unicorn" ? "L’unicorno" : "L’esploratore"} di LeggiAmo al livello ${stage}`;
  for (const button of worldButtons) button.setAttribute("aria-pressed", String(button.dataset.world === world));
  for (const button of stageButtons) button.setAttribute("aria-pressed", String(Number(button.dataset.stage) === stage));
  document.querySelector("#world-status").textContent = `Livello ${stage}: ${title}`;
}
for (const button of worldButtons) {
  button.addEventListener("click", () => {
    world = button.dataset.world;
    updateScene();
  });
}
for (const button of stageButtons) {
  button.addEventListener("click", () => {
    stage = Number(button.dataset.stage);
    updateScene();
  });
}

for (const menu of document.querySelectorAll(".nav-menu")) {
  for (const link of menu.querySelectorAll("a")) link.addEventListener("click", () => { menu.open = false; });
}
document.addEventListener("click", (event) => {
  for (const menu of document.querySelectorAll(".nav-menu[open]")) if (!menu.contains(event.target)) menu.open = false;
});
