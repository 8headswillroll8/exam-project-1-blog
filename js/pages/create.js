import "../ui/header.js";
import { createPost } from "../api/posts.js";

// ===== Elements =====
const form = document.querySelector("form");

const titleInput = document.getElementById("title");
const titleError = document.getElementById("title-error");

const tagInput = document.getElementById("tag");
const tagError = document.getElementById("tag-error");

const imageInput = document.getElementById("image");
const imageError = document.getElementById("img-error");

const bodyInput = document.getElementById("body");
const bodyError = document.getElementById("body-error");

const formError = document.getElementById("create-error");
const publishBtn = document.getElementById("publish-btn");

// ===== Auth gate =====
const accessToken = localStorage.getItem("accessToken");
const profileName = localStorage.getItem("profileName");

if (!accessToken || !profileName) {
  window.location.href = "../account/login.html";
}

// ===== Helpers =====
function setFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.setAttribute("aria-invalid", "true");
}

function clearFieldError(inputEl, errorEl) {
  errorEl.textContent = "";
  inputEl.removeAttribute("aria-invalid");
}

function clearAllErrors() {
  clearFieldError(titleInput, titleError);
  clearFieldError(tagInput, tagError);
  clearFieldError(imageInput, imageError);
  clearFieldError(bodyInput, bodyError);

  if (formError) {
    formError.textContent = "";
    formError.classList.remove("is-visible");
  }
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function parseTags(value) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ===== Submit handler =====
form.addEventListener("submit", onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  clearAllErrors();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const imageUrl = imageInput.value.trim();
  const tagText = tagInput.value.trim();

  let isValid = true;

  if (title === "") {
    setFieldError(
      titleInput,
      titleError,
      "Add a title so readers know what this post is about",
    );
    isValid = false;
  }

  if (body === "") {
    setFieldError(bodyInput, bodyError, "Write a body to publish your post");
    isValid = false;
  }

  if (tagText === "") {
    setFieldError(tagInput, tagError, "Add at least one tag");
    isValid = false;
  }

  if (imageUrl !== "" && !isValidUrl(imageUrl)) {
    setFieldError(imageInput, imageError, "Enter a valid URL");
    isValid = false;
  }

  if (!isValid) {
    if (formError) {
      formError.textContent = "Finish the missing fields to publish this post";
      formError.classList.add("is-visible");
    }
    return;
  }

  const payload = {
    title,
    body,
    tags: parseTags(tagText),
    media: imageUrl ? { url: imageUrl, alt: title } : undefined,
  };

  // Remove undefined so you don't send media when empty
  if (!payload.media) {
    delete payload.media;
  }

  publishBtn.classList.add("is-loading");
  publishBtn.disabled = true;

  try {
    const result = await createPost(payload);

    const id = result?.data?.id;
    if (id) {
      window.location.href = `../post/index.html?name=${profileName}&id=${id}`;
      return;
    }

    window.location.href = "../index.html";
  } catch (error) {
    if (formError) {
      formError.textContent = error.message;
      formError.classList.add("is-visible");
    }
  } finally {
    publishBtn.classList.remove("is-loading");
    publishBtn.disabled = false;
  }
}
