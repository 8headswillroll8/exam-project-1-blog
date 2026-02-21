import "../ui/header.js";
import { getOwnerById, updatePost, deletePost } from "../api/posts.js";

// ===== Elements =====
const form = document.querySelector("form");

const titleInput = document.getElementById("title");
const tagInput = document.getElementById("tag");
const imageInput = document.getElementById("image");
const bodyInput = document.getElementById("body");

const deleteBtn = document.getElementById("delete-btn");
const doneBtn = document.getElementById("done-btn");

// ===== Auth gate =====
const accessToken = localStorage.getItem("accessToken");
const profileName = localStorage.getItem("profileName");

if (!accessToken || !profileName) {
  window.location.href = "../account/login.html";
}

// ===== Get id from URL =====
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  window.location.href = "../index.html";
}

// ===== Load existing post =====
loadPost();

async function loadPost() {
  try {
    const result = await getOwnerById(id);
    const post = result.data;

    titleInput.value = post.title || "";
    bodyInput.value = post.body || "";

    // tags array -> comma string
    tagInput.value = Array.isArray(post.tags) ? post.tags.join(", ") : "";

    // media url
    imageInput.value = post.media?.url || "";
  } catch (error) {
    alert(error.message);
    window.location.href = "../index.html";
  }
}

// ===== Submit (PUT) =====
form.addEventListener("submit", onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const tagsText = tagInput.value.trim();
  const imageUrl = imageInput.value.trim();

  if (title === "" || body === "") {
    alert("Add a title and body before saving.");
    return;
  }

  const payload = {
    title,
    body,
    tags: tagsText
      ? tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    media: imageUrl ? { url: imageUrl, alt: title } : undefined,
  };

  if (!payload.media) {
    delete payload.media;
  }

  doneBtn.classList.add("is-loading");
  doneBtn.disabled = true;

  try {
    const result = await updatePost(id, payload);
    const updatedId = result?.data?.id || id;

    window.location.href = `../post/index.html?id=${updatedId}`;
  } catch (error) {
    alert(error.message);
  } finally {
    doneBtn.classList.remove("is-loading");
    doneBtn.disabled = false;
  }
}

// ===== Delete (DELETE) =====
deleteBtn.addEventListener("click", onDelete);

async function onDelete() {
  const ok = confirm("Delete this post? This cannot be undone.");
  if (!ok) return;

  deleteBtn.classList.add("is-loading");
  deleteBtn.disabled = true;

  try {
    await deletePost(id);
    window.location.href = "../index.html";
  } catch (error) {
    alert(error.message);
  } finally {
    deleteBtn.classList.remove("is-loading");
    deleteBtn.disabled = false;
  }
}
