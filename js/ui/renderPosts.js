export function renderPosts(containerEl, posts) {
  containerEl.innerHTML = "";

  const markup = posts
    .map((post) => {
      const imageUrl = post.media?.url || "./assets/img/fallback.webp";
      const imageAlt = post.media?.alt || post.title;
      const tag = post.tags?.[0] || "";
      const date = new Date(post.created);
      const displayDate = date.toLocaleDateString("no-NO");

      return `
      <article class="post-card">
        <a href="./post/index.html?id=${post.id}">
          <div class="post-card__header">
            <h2 class="post-card__title">
              ${post.title}
            </h2>
            <img
              class="post-card__icon"
              src="./assets/graphics/arrow-upper-right-icon.svg"
              alt="Arrow pointing to upper right corner"
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
}
