export function renderPosts(containerEl, posts) {
  containerEl.innerHTML = "";

  const accessToken = localStorage.getItem("accessToken");
  const profileName = localStorage.getItem("profileName");
  const isLoggedIn = Boolean(accessToken) && Boolean(profileName);

  const markup = posts
    .map((post) => {
      const imageUrl = post.media?.url || "./assets/img/fallback.webp";
      const imageAlt = post.media?.alt || post.title;
      const tag = post.tags?.[0] || "";
      const date = new Date(post.created);
      const displayDate = date.toLocaleDateString("no-NO");

      const isOwner = isLoggedIn && post.author?.name === profileName;

      const iconSrc = isOwner
        ? "./assets/graphics/edit-icon.svg"
        : "./assets/graphics/arrow-upper-right-icon.svg";

      const iconAlt = isOwner ? "Edit post" : "Open post";

      const iconMarkup = isOwner
        ? `<img
            class="post-card__icon post-card__icon--edit"
            src="${iconSrc}"
            alt="${iconAlt}"
            data-edit-id="${post.id}"
          />`
        : `<img
            class="post-card__icon"
            src="${iconSrc}"
            alt="${iconAlt}"
          />`;

      return `
        <article class="post-card">
          <a href="post/index.html?name=innova&id=${post.id}">
            <div class="post-card__header">
              <h2 class="post-card__title">${post.title}</h2>
              ${iconMarkup}
            </div>

            <div class="post-card__media">
              <img class="post-card__image" src="${imageUrl}" alt="${imageAlt}" />
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

  if (isLoggedIn && !containerEl.dataset.editBound) {
    containerEl.dataset.editBound = "true";

    containerEl.addEventListener("click", (event) => {
      const icon = event.target.closest("[data-edit-id]");
      if (!icon) return;

      event.preventDefault();
      event.stopPropagation();

      const id = icon.dataset.editId;
      window.location.href = `post/edit.html?name=innova&id=${id}`;
    });
  }
}
