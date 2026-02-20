import "../ui/header.js";
import { registerUser } from "../api/auth.js";

// ===== Elements =====
const form = document.querySelector(".wrapper");

const emailInput = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const passwordInput = document.querySelector("#password");
const passwordError = document.querySelector("#password-error");

const confirmPasswordInput = document.querySelector("#confirm-password");
const confirmPasswordError = document.querySelector("#confirm-password-error");

const registerError = document.querySelector("#register-error");
const registerBtn = document.querySelector("#register-btn");

// ===== "Touched" flags =====
let emailTouched = false;
let passwordTouched = false;
let confirmPasswordTouched = false;

// ===== Validators =====
function validateEmail() {
  const value = emailInput.value.trim();

  if (value === "") {
    emailError.textContent = "Email is required";
    emailInput.setAttribute("aria-invalid", "true");
    return false;
  }

  if (!value.endsWith("@stud.noroff.no")) {
    emailError.textContent = "Email must end with @stud.noroff.no";
    emailInput.setAttribute("aria-invalid", "true");
    return false;
  }

  emailError.textContent = "";
  emailInput.removeAttribute("aria-invalid");
  return true;
}

function validatePassword() {
  const value = passwordInput.value.trim();

  if (value === "") {
    passwordError.textContent = "Password is required";
    passwordInput.setAttribute("aria-invalid", "true");
    return false;
  }

  if (value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters";
    passwordInput.setAttribute("aria-invalid", "true");
    return false;
  }

  passwordError.textContent = "";
  passwordInput.removeAttribute("aria-invalid");
  return true;
}

function validateConfirmPassword() {
  const value = confirmPasswordInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  if (value === "") {
    confirmPasswordError.textContent = "Please confirm password";
    confirmPasswordInput.setAttribute("aria-invalid", "true");
    return false;
  }

  if (value !== passwordValue) {
    confirmPasswordError.textContent = "Passwords do not match";
    confirmPasswordInput.setAttribute("aria-invalid", "true");
    return false;
  }

  confirmPasswordError.textContent = "";
  confirmPasswordInput.removeAttribute("aria-invalid");
  return true;
}

// ===== Field events =====
emailInput.addEventListener("blur", () => {
  emailTouched = true;
  validateEmail();
});

passwordInput.addEventListener("blur", () => {
  passwordTouched = true;
  validatePassword();
});

confirmPasswordInput.addEventListener("blur", () => {
  confirmPasswordTouched = true;
  validateConfirmPassword();
});

emailInput.addEventListener("input", () => {
  if (!emailTouched) return;
  validateEmail();
});

passwordInput.addEventListener("input", () => {
  if (!passwordTouched) return;

  validatePassword();

  if (confirmPasswordTouched) {
    validateConfirmPassword();
  }
});

confirmPasswordInput.addEventListener("input", () => {
  if (!confirmPasswordTouched) return;
  validateConfirmPassword();
});

// ===== Submit handler =====
form.addEventListener("submit", onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  emailTouched = true;
  passwordTouched = true;
  confirmPasswordTouched = true;

  registerError.textContent = "";
  registerError.classList.remove("is-visible");

  const emailOk = validateEmail();
  const passwordOk = validatePassword();
  const confirmPasswordOk = validateConfirmPassword();

  if (!emailOk || !passwordOk || !confirmPasswordOk) {
    registerError.textContent = "Please correct the highlighted fields.";
    registerError.classList.add("is-visible");
    return;
  }

  registerBtn.classList.add("is-loading");
  registerBtn.disabled = true;

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const name = email.split("@")[0];

    await registerUser({ name, email, password });

    window.location.href = "../account/login.html";
  } catch (error) {
    registerError.textContent = error.message;
    registerError.classList.add("is-visible");
  } finally {
    registerBtn.classList.remove("is-loading");
    registerBtn.disabled = false;
  }
}
