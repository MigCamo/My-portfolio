"use strict";

// Estado local de presentación; contenido y enlaces no dependen del shell.
const themeButton = document.querySelector(".theme-toggle");
function syncThemeLabel() {
  const light = document.documentElement.dataset.theme === "light";
  themeButton.setAttribute(
    "aria-label",
    `Activar tema ${light ? "oscuro" : "claro"}`,
  );
  document.querySelector('meta[name="theme-color"]').content = light
    ? "#f6f7f9"
    : "#0d1117";
}
function toggleTheme() {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    /* Persistencia opcional. */
  }
  syncThemeLabel();
}
themeButton.addEventListener("click", toggleTheme);
syncThemeLabel();

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const filters = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    let visible = 0;
    projects.forEach((project) => {
      project.hidden =
        button.dataset.filter !== "all" &&
        project.dataset.category !== button.dataset.filter;
      if (!project.hidden) visible += 1;
    });
    filters.forEach((filter) => {
      filter.classList.toggle("active", filter === button);
      filter.setAttribute("aria-pressed", String(filter === button));
    });
    document.querySelector("#project-status").textContent =
      `${visible} proyectos visibles`;
  }),
);

const copyButton = document.querySelector(".copy-email");
let copyReset;
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("miguel_camo@outlook.com");
    copyButton.textContent = "Correo copiado";
    document.querySelector("#copy-status").textContent =
      "Correo copiado al portapapeles.";
    clearTimeout(copyReset);
    copyReset = setTimeout(() => {
      copyButton.textContent = "Copiar correo";
    }, 3000);
  } catch {
    document.querySelector("#copy-status").textContent =
      "No se pudo copiar. Puedes seleccionar el correo o abrir el enlace para escribir.";
    copyButton.textContent = "Selecciona el correo para copiarlo";
  }
});

// Intérprete acotado a acciones del portafolio: sin eval, shell del sistema o red.
const terminalForm = document.querySelector("#terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector("#terminal-output");
const commandHistory = [];
let historyPosition = 0;
let draftCommand = "";
const destinations = Object.freeze({
  inicio: "inicio",
  home: "inicio",
  "~": "inicio",
  "..": "inicio",
  "sobre-mi": "sobre-mi",
  "sobre_mí.md": "sobre-mi",
  about: "sobre-mi",
  experiencia: "experiencia",
  "experiencia.log": "experiencia",
  aries: "experiencia",
  proyectos: "proyectos",
  projects: "proyectos",
  stack: "stack",
  "stack.conf": "stack",
  contacto: "contacto",
  "contacto.sh": "contacto",
});
const completions = [
  "help",
  "whoami",
  "neofetch",
  "ls",
  "pwd",
  "cv",
  "theme",
  "clear",
  "cd proyectos",
  "cd experiencia",
  "cd sobre-mi",
  "cd stack",
  "cd contacto",
  "cat stack.conf",
  "cat sobre_mí.md",
];
function appendOutput(command, text, error = false) {
  const entry = document.createElement("div");
  entry.className = error ? "terminal-entry command-error" : "terminal-entry";
  const echo = document.createElement("p");
  echo.className = "command-echo";
  echo.textContent = `~ $ ${command}`;
  const result = document.createElement("pre");
  result.textContent = text;
  entry.append(echo, result);
  terminalOutput.append(entry);
  while (terminalOutput.children.length > 12)
    terminalOutput.firstElementChild.remove();
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
function navigateToDirectory(directory) {
  const key = directory.replace(/^\.\//, "").replace(/\/$/, "");
  if (!Object.hasOwn(destinations, key)) return false;
  const section = document.getElementById(destinations[key]);
  section.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
  history.replaceState(null, "", `#${section.id}`);
  closeMenu();
  return true;
}
function runCommand(raw) {
  const command = raw.trim().replace(/\s+/g, " ");
  if (!command) return;
  commandHistory.push(command);
  if (commandHistory.length > 30) commandHistory.shift();
  historyPosition = commandHistory.length;
  const normalized = command.toLowerCase();
  if (normalized === "clear") {
    terminalOutput.replaceChildren();
    return;
  }
  const profile =
    "Miguel Ángel Camo Rincón\nIngeniero en software · Universidad Veracruzana\nFull stack: frontend, backend e integración de servicios.\nAhora: frontend, arquitectura y QA en Equipo ARIES.\nXalapa, Veracruz, México.";
  const output = {
    help: "Comandos disponibles:\n  whoami           Conocer mi perfil\n  neofetch         Volver a la ficha del perfil\n  ls               Listar secciones\n  cd proyectos     Ir a una sección (experiencia, stack, contacto...)\n  cat stack.conf   Consultar tecnologías\n  pwd              Mostrar ubicación\n  cv               Descargar mi currículum\n  theme            Alternar tema\n  clear            Limpiar la terminal",
    whoami: profile,
    ls: "sobre_mí.md     experiencia.log     proyectos/\nstack.conf      contacto.sh         curriculum.pdf\n\nPrueba: cd proyectos",
    pwd: "~/portfolio",
    "cat sobre_mí.md": profile,
    "cat stack.conf":
      "[frontend] Angular, React, Vue.js, TypeScript, JavaScript\n[backend]  C# / .NET, Java / Spring Boot, PHP / Laravel, Node.js\n[datos]    SQL Server, MySQL, PostgreSQL\n[calidad]  Cypress, Git, Docker, Podman, Postman",
  };
  if (Object.hasOwn(output, normalized))
    appendOutput(command, output[normalized]);
  else if (normalized === "neofetch" || normalized === "neofetch --profile") {
    appendOutput(command, profile);
    navigateToDirectory("inicio");
  } else if (normalized === "theme") {
    toggleTheme();
    appendOutput(
      command,
      `Tema ${document.documentElement.dataset.theme === "dark" ? "oscuro" : "claro"} activado.`,
    );
  } else if (normalized === "cv") {
    appendOutput(command, "Descargando curriculum.pdf...");
    document.querySelector(".hero-buttons a[download]").click();
  } else if (normalized.startsWith("cd ")) {
    const directory = normalized.slice(3);
    if (
      Object.hasOwn(
        destinations,
        directory.replace(/^\.\//, "").replace(/\/$/, ""),
      )
    ) {
      appendOutput(command, `Abriendo ${directory}...`);
      navigateToDirectory(directory);
    } else
      appendOutput(
        command,
        `No existe esa sección: ${directory}\nUsa ls para consultar los destinos.`,
        true,
      );
  } else
    appendOutput(
      command,
      `Comando no disponible. Escribe help para ver las opciones.`,
      true,
    );
}
terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(terminalInput.value);
  terminalInput.value = "";
  draftCommand = "";
});
document.querySelectorAll("[data-command]").forEach((button) =>
  button.addEventListener("click", () => {
    runCommand(button.dataset.command);
    terminalInput.focus({ preventScroll: true });
  }),
);
terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && terminalInput.value.trim()) {
    const candidates = completions.filter((command) =>
      command.startsWith(terminalInput.value.toLowerCase()),
    );
    // Una coincidencia exacta conserva Tab para salir del campo con teclado.
    if (candidates.length === 1 && candidates[0] !== terminalInput.value) {
      event.preventDefault();
      terminalInput.value = candidates[0];
    }
  }
  if (
    (event.key === "ArrowUp" || event.key === "ArrowDown") &&
    commandHistory.length
  ) {
    event.preventDefault();
    if (historyPosition === commandHistory.length)
      draftCommand = terminalInput.value;
    historyPosition = Math.max(
      0,
      Math.min(
        commandHistory.length,
        historyPosition + (event.key === "ArrowUp" ? -1 : 1),
      ),
    );
    terminalInput.value = commandHistory[historyPosition] ?? draftCommand;
    terminalInput.setSelectionRange(
      terminalInput.value.length,
      terminalInput.value.length,
    );
  }
});
document.addEventListener("keydown", (event) => {
  const editing =
    event.target instanceof Element &&
    event.target.closest("input, textarea, select, [contenteditable]");
  if (
    event.key === "/" &&
    !editing &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault();
    terminalInput.focus();
  }
  if (event.key === "Escape") {
    if (menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    } else if (document.activeElement === terminalInput) terminalInput.blur();
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
        if (link.hash === `#${visible.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
}
document.querySelector("#year").textContent = String(new Date().getFullYear());
document.documentElement.classList.add("js");
