import "../ui/header.js";
import { getAllPost } from "../api/posts.js";
import { renderPosts } from "../ui/renderPosts.js";

/* DOM elements */
const loadingEl = document.getElementById("posts-loading");
const errorEl = document.getElementById("posts-error");
const postsGrid = document.getElementById("posts-grid");

/* Reset UI */
postsGrid.innerHTML = "";
errorEl.classList.remove("is-visible");
errorEl.textContent = "";

/* Loading state */
loadingEl.textContent = "Loading posts...";
loadingEl.classList.add("is-visible");

async function initFeed() {
  try {
    const response = await getAllPost();

    const posts = Array.isArray(response.data) ? response.data : [];
    posts.sort((a, b) => new Date(b.created) - new Date(a.created));

    const latest12 = posts.slice(0, 12);
    renderPosts(postsGrid, latest12);
  } catch (err) {
    errorEl.textContent = "Could not load posts. Please try again.";
    errorEl.classList.add("is-visible");
  } finally {
    loadingEl.classList.remove("is-visible");
  }
}

initFeed();
