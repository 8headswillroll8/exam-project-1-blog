import { isLoggedIn, logout } from "../api/session.js";

const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const logo = document.querySelector(".logo");

const userItems = document.querySelectorAll('[data-auth="user"]');
const guestItems = document.querySelectorAll('[data-auth="guest"]');
const logoutLink = document.querySelector(".nav-link--logout");

// ===== Auth UI =====
function updateAuthUI() {
  const loggedIn = isLoggedIn();

  userItems.forEach((item) => {
    item.hidden = !loggedIn;
  });

  guestItems.forEach((item) => {
    item.hidden = loggedIn;
  });

  // Optional styling hook
  navbar.classList.toggle("is-auth", loggedIn);
}

// Run on load
updateAuthUI();

// ===== Logout =====
if (logoutLink) {
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
    updateAuthUI();
    window.location.href = "../index.html";
  });
}

// ===== Mobile menu =====
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
