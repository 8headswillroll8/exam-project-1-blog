const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const logo = document.querySelector(".logo");

hamburger.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("menu-open");

  hamburger.classList.toggle("active", isOpen);
  navMenu.classList.toggle("active", isOpen);

  logo.src = isOpen ? logo.dataset.light : logo.dataset.dark;

  hamburger.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("menu-open");
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");

    logo.src = logo.dataset.dark;
    hamburger.setAttribute("aria-expanded", "false");
  });
});
