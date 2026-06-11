/**
 * Mobile hamburger navigation toggle.
 *
 * Last edited: 2026-06-11
 */

(function initMobileNav() {
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("site-nav-menu");
  if (!nav || !toggle || !menu) {
    return;
  }

  var mobileQuery = window.matchMedia("(max-width: 768px)");

  function isMobile() {
    return mobileQuery.matches;
  }

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (isMobile()) {
      menu.hidden = !open;
    } else {
      menu.hidden = false;
    }
  }

  function closeMenu() {
    setOpen(false);
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target)) {
      closeMenu();
    }
  });

  mobileQuery.addEventListener("change", function () {
    if (!isMobile()) {
      closeMenu();
      menu.hidden = false;
    } else if (!nav.classList.contains("is-open")) {
      menu.hidden = true;
    }
  });

  if (isMobile()) {
    menu.hidden = true;
  }
})();
