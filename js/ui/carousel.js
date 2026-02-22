const carouselTrack = document.getElementById("carousel-track");
const viewport = document.getElementById("carousel-viewport");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");

let featuredPosts = [];
let startIndex = 0;

const accessToken = localStorage.getItem("accessToken");
const profileName = localStorage.getItem("profileName");

const isLoggedIn = Boolean(accessToken) && Boolean(profileName);

function renderCarousel() {
  carouselTrack.innerHTML = "";

  featuredPosts.forEach((post) => {
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

    carouselTrack.innerHTML += `
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
  });
}

function getPerView() {
  const styles = getComputedStyle(viewport);
  return Number(styles.getPropertyValue("--per-view")) || 1;
}

function clampIndex() {
  const perView = getPerView();
  const maxStart = Math.max(0, featuredPosts.length - perView);

  if (startIndex > maxStart) startIndex = 0;
  if (startIndex < 0) startIndex = maxStart;
}

function updatePosition() {
  clampIndex();

  const firstCard = carouselTrack.querySelector(".post-card");
  if (!firstCard) return;

  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
  const cardWidth = firstCard.getBoundingClientRect().width;

  const stepPx = cardWidth + gap;
  const offsetPx = startIndex * stepPx;

  carouselTrack.style.transform = `translateX(-${offsetPx}px)`;
}

function showNext() {
  startIndex += 1;
  updatePosition();
}

function showPrev() {
  startIndex -= 1;
  updatePosition();
}

export function initCarousel(posts) {
  if (!carouselTrack || !viewport || !prevBtn || !nextBtn) return;

  featuredPosts = posts.slice(0, 12);
  startIndex = 0;

  if (featuredPosts.length === 0) return;

  renderCarousel();
  updatePosition();

  if (!nextBtn.dataset.bound) {
    nextBtn.dataset.bound = "true";
    nextBtn.addEventListener("click", showNext);
  }

  if (!prevBtn.dataset.bound) {
    prevBtn.dataset.bound = "true";
    prevBtn.addEventListener("click", showPrev);
  }

  if (!viewport.dataset.resizeBound) {
    viewport.dataset.resizeBound = "true";
    window.addEventListener("resize", updatePosition);
  }

  if (isLoggedIn && !carouselTrack.dataset.editBound) {
    carouselTrack.dataset.editBound = "true";

    carouselTrack.addEventListener("click", (event) => {
      const icon = event.target.closest("[data-edit-id]");
      if (!icon) return;

      event.preventDefault();
      event.stopPropagation();

      window.location.href = `post/edit.html?name=innova&id=${icon.dataset.editId}`;
    });
  }
}
