// Antes del primer render para evitar parpadeos de tema.
(() => {
  let storedTheme;
  try {
    storedTheme = localStorage.getItem("portfolio-theme");
  } catch {
    /* Persistencia opcional. */
  }
  document.documentElement.dataset.theme =
    storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
})();
