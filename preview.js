/**
 * App preview carousel with real screenshots from assets/previews/.
 *
 * Last edited: 2026-06-11
 */

(function initPreviewCarousel() {
  var slides = [
    {
      src: "assets/previews/home.png",
      alt: "Nothing Do home screen with daily steps, habits, and week chart",
      caption: "Home. Your day in one calm view.",
    },
    {
      src: "assets/previews/tasks.png",
      alt: "Nothing Do tasks list with step counts and time estimates",
      caption: "Tasks. Break work into steps you can finish.",
    },
    {
      src: "assets/previews/habits.png",
      alt: "Nothing Do habits with streak dots and daily check-ins",
      caption: "Habits. Small repeats that compound.",
    },
    {
      src: "assets/previews/focus.png",
      alt: "Nothing Do focus timer on a single step",
      caption: "Focus. One step, one timer, zero noise.",
    },
    {
      src: "assets/previews/task-detail.png",
      alt: "Nothing Do task detail with steps and start focus action",
      caption: "Task detail. See what is next, then start.",
    },
    {
      src: "assets/previews/habit-detail.png",
      alt: "Nothing Do habit detail with streak and mark done",
      caption: "Habit detail. Streaks without the guilt spiral.",
    },
    {
      src: "assets/previews/settings.png",
      alt: "Nothing Do settings with stats and preferences",
      caption: "Settings. Tasks, focus, and habits in one place.",
    },
  ];

  var root = document.querySelector("[data-preview-root]");
  if (!root) {
    return;
  }

  var image = root.querySelector("[data-preview-image]");
  var caption = root.querySelector("[data-preview-caption]");
  var dotsWrap = root.querySelector("[data-preview-dots]");
  var carousel = root.querySelector("[data-preview-carousel]");
  var prevBtn = root.querySelector("[data-preview-prev]");
  var nextBtn = root.querySelector("[data-preview-next]");

  if (!image || !caption || !dotsWrap || !carousel) {
    return;
  }

  var current = 0;
  var timer = null;
  var touchStartX = 0;
  var motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var crossfadeMs = 220;

  slides.forEach(function (slide, index) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Show screen " + (index + 1));
    dot.addEventListener("click", function () {
      goTo(index, true);
    });
    dotsWrap.appendChild(dot);
  });

  var dots = dotsWrap.children;

  function updateChrome() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === current);
    }
  }

  function applySlide(instant) {
    var slide = slides[current];

    if (instant || motionReduced) {
      image.classList.remove("is-fading");
      caption.classList.remove("is-changing");
      image.src = slide.src;
      image.alt = slide.alt;
      caption.textContent = slide.caption;
      updateChrome();
      return;
    }

    image.classList.add("is-fading");
    caption.classList.add("is-changing");
    updateChrome();

    window.setTimeout(function () {
      image.src = slide.src;
      image.alt = slide.alt;
      caption.textContent = slide.caption;
      image.classList.remove("is-fading");
      caption.classList.remove("is-changing");
    }, crossfadeMs);
  }

  function goTo(index, manual) {
    var next = (index + slides.length) % slides.length;
    if (next === current) {
      return;
    }
    current = next;
    applySlide(false);
    if (manual) {
      restartAutoplay();
    }
  }

  function restartAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timer = setInterval(function () {
      goTo(current + 1, false);
    }, 5000);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goTo(current - 1, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goTo(current + 1, true);
    });
  }

  carousel.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      goTo(current - 1, true);
    }
    if (event.key === "ArrowRight") {
      goTo(current + 1, true);
    }
  });

  carousel.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    function (event) {
      var delta = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) < 40) {
        return;
      }
      if (delta < 0) {
        goTo(current + 1, true);
      } else {
        goTo(current - 1, true);
      }
    },
    { passive: true }
  );

  applySlide(true);
  restartAutoplay();
})();
