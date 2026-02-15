import { renderPostSingle } from "../ui/renderPostSingle.js";
import { getById } from "../api/posts.js";

const containerEl = document.querySelector(".post-single");
const loadingEl = document.querySelector("post-loading");
const errorEl = document.querySelector("post-error");
const shareBtn = document.querySelector("share-btn");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function initPost() {
  if (!postId) {
    containerEl.textContent = "Post not found.";
    return;
  }

  try {
    const response = await getById(postId);
    const post = response.data;

    renderPostSingle(containerEl, post);
  } catch (error) {
    containerEl.textContent = "Could not load post.";
  }
}

initPost();
