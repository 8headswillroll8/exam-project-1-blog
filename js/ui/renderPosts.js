export function renderPosts(containerEl, posts) {
  containerEl.innerHTML = "";

  const isLoggedIn =
    Boolean(localStorage.getItem("accessToken")) &&
    Boolean(localStorage.getItem("profileName"));

  const markup = posts
    .map((post) => {
      const imageUrl = post.media?.url || "./assets/img/fallback.webp";
      const imageAlt = post.media?.alt || post.title;
      const tag = post.tags?.[0] || "";
      const date = new Date(post.created);
      const displayDate = date.toLocaleDateString("no-NO");

      const iconSrc = isLoggedIn
        ? "./assets/graphics/edit-icon.svg"
        : "./assets/graphics/arrow-upper-right-icon.svg";

      const iconAlt = isLoggedIn ? "Edit post" : "Open post";

      return `
      <article class="post-card">
        <a href="./post/index.html?id=${post.id}">
          <div class="post-card__header">
            <h2 class="post-card__title">
              ${post.title}
            </h2>
            <img
              class="post-card__icon ${isLoggedIn ? "post-card__icon--edit" : ""}"
              src="${iconSrc}"
              alt="${iconAlt}"
              data-edit-id="${post.id}"
            />
          </div>

          <div class="post-card__media">
            <img
              class="post-card__image"
              src="${imageUrl}"
              alt="${imageAlt}"
            />
          </div>

          <div class="post-card__meta">
            <p class="post-card__tag">${tag}</p>
            <time class="post-card__date" datetime="${post.created}">
              ${displayDate}
            </time>
          </div>
        </a>
      </article>
    `;
    })
    .join("");

  containerEl.innerHTML = markup;

  // Only bind once, avoid stacking listeners on re-render
  if (isLoggedIn && !containerEl.dataset.editBound) {
    containerEl.dataset.editBound = "true";

    containerEl.addEventListener("click", (event) => {
      const icon = event.target.closest("[data-edit-id]");
      if (!icon) return;

      event.preventDefault();
      event.stopPropagation();

      const id = icon.dataset.editId;
      window.location.href = `./post/edit.html?id=${id}`;
    });
  }
}
