export function renderPostSingle(containerEl, post) {
  const imageUrl = post.media?.url || "../assets/img/fallback.webp";
  const imageAlt = post.media?.alt || post.title;
  const tag = post.tags?.[0] || "";
  const date = new Date(post.created);
  const displayDate = date.toLocaleDateString("no-NO");

  const markup = `
    <div class="post-single__header">
      <h1 class="post-single__title">${post.title}</h1>

      <div class="post-single__media">
        <img
          class="post-single__image"
          src="${imageUrl}"
          alt="${imageAlt}"
        />

        <div class="post-single__meta">
          <p class="post-single__tag">${tag}</p>
          <time class="post-single__date" datetime="${post.created}">
            ${displayDate}
          </time>
        </div>
      </div>
    </div>

    <div class="post-single__body">
      <p class="post-single__text">
        ${post.body}
      </p>
    </div>
  `;

  containerEl.innerHTML = markup;
}
