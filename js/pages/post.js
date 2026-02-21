import { renderPostSingle } from "../ui/renderPostSingle.js";
import { getPublicById } from "../api/posts.js";

// ===== Elements =====
const containerEl = document.querySelector(".post-single");
const loadingEl = document.querySelector("#post-loading");
const errorEl = document.querySelector("#post-error");
const shareBtn = document.querySelector("#share-btn");

// ===== Get id from URL =====
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

// ===== Init =====
async function initPost() {
  if (!postId) {
    containerEl.textContent = "Post not found.";
    return;
  }

  try {
    loadingEl?.classList.add("is-visible");

    const response = await getPublicById(postId);
    const post = response.data;

    renderPostSingle(containerEl, post);
  } catch (error) {
    errorEl.textContent = "Could not load post.";
    errorEl.classList.add("is-visible");
  } finally {
    loadingEl?.classList.remove("is-visible");
  }
}

initPost();

// ===== Share button =====
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch {
      alert(`Copy this link:\n${url}`);
    }
  });
}
