import "../ui/header.js";

// ===== Elements =====
const form = document.querySelector("form");

const emailInput = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const passwordInput = document.querySelector("#password");
const passwordError = document.querySelector("#password-error");

const loginError = document.querySelector("#login-error");

// ===== "Touched" flags =====
// Used to avoid showing errors while the user is typing for the first time.
// After the first blur or after a failed submit, we validate on input too.
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
// On blur, mark touched and validate (this is when errors first appear).
emailInput.addEventListener("blur", () => {
  emailTouched = true;
  validateEmail();
});

passwordInput.addEventListener("blur", () => {
  passwordTouched = true;
  validatePassword();
});

// On input, only validate after the field has been touched.
// This lets errors clear immediately while the user fixes them.
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

function onSubmit(event) {
  event.preventDefault();

  // After a submit attempt, treat fields as touched
  // so live fixes clear errors instantly.
  emailTouched = true;
  passwordTouched = true;

  // Clear the form-level error alert
  loginError.textContent = "";
  loginError.classList.remove("is-visible");

  // Validate everything as the final gate
  const emailOk = validateEmail();
  const passwordOk = validatePassword();

  // Stop if invalid and show a general message at the top
  if (!emailOk || !passwordOk) {
    loginError.textContent = "Please correct the highlighted fields.";
    loginError.classList.add("is-visible");
    return;
  }

  // Next step
  // 1) Send login request
  // 2) Store access token + profile name
  // 3) Redirect to feed page
}
