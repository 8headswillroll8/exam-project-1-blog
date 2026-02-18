import "../ui/header.js";
import { loginUser } from "../api/auth.js";

// ===== Elements =====
const form = document.querySelector("form");

const emailInput = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const passwordInput = document.querySelector("#password");
const passwordError = document.querySelector("#password-error");

const loginError = document.querySelector("#login-error");
const loginBtn = document.querySelector("#login-btn");

// ===== "Touched" flags =====
// Used to avoid showing errors while the user is typing the first time.
// After blur or a failed submit, validation runs on input as well.
let emailTouched = false;
let passwordTouched = false;

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

  // Valid
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

  // Valid
  passwordError.textContent = "";
  passwordInput.removeAttribute("aria-invalid");
  return true;
}

// ===== Field events =====
// Blur shows errors for the first time
emailInput.addEventListener("blur", () => {
  emailTouched = true;
  validateEmail();
});

passwordInput.addEventListener("blur", () => {
  passwordTouched = true;
  validatePassword();
});

// Input clears errors live, but only after the field was touched
emailInput.addEventListener("input", () => {
  if (!emailTouched) return;
  validateEmail();
});

passwordInput.addEventListener("input", () => {
  if (!passwordTouched) return;
  validatePassword();
});

// ===== Submit handler =====
form.addEventListener("submit", onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  // After submit attempt, treat both fields as touched
  // so fixes clear errors immediately
  emailTouched = true;
  passwordTouched = true;

  // Clear form-level error
  loginError.textContent = "";
  loginError.classList.remove("is-visible");

  // Final validation gate
  const emailOk = validateEmail();
  const passwordOk = validatePassword();

  if (!emailOk || !passwordOk) {
    loginError.textContent = "Please correct the highlighted fields.";
    loginError.classList.add("is-visible");
    return;
  }

  // ===== Loading state ON =====
  // Spinner appears, button disables
  loginBtn.classList.add("is-loading");
  loginBtn.disabled = true;

  try {
    // Send login request
    const result = await loginUser(
      emailInput.value.trim(),
      passwordInput.value.trim(),
    );

    // Successful login
    const { accessToken, name } = result.data;

    // Store session
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("profileName", name);

    // Redirect to feed
    window.location.href = "/index.html";
  } catch (error) {
    // Show API error
    loginError.textContent = error.message;
    loginError.classList.add("is-visible");
  } finally {
    // ===== Loading state OFF =====
    // Always runs, success or error
    loginBtn.classList.remove("is-loading");
    loginBtn.disabled = false;
  }
}
