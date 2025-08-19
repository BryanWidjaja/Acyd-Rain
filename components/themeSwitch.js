const themeBtn = document.getElementById("theme-btn");
const themeIcon = document.querySelector(".theme-icon");

const dark = "./assets/icons/dark.svg";
const light = "./assets/icons/light.svg";

let currThemeSetting = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currThemeSetting);

if (themeIcon) {
  themeIcon.src = currThemeSetting === "dark" ? light : dark;
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const newTheme = currThemeSetting === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    currThemeSetting = newTheme;

    if (themeIcon) {
      themeIcon.src = newTheme === "dark" ? light : dark;
    }
  });
}
