/**
 * Keep the home page anchored on the hero when opening or returning home.
 *
 * Last edited: 2026-06-11
 */

(function initHomeScroll() {
  var hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function isHeroEntry() {
    var hash = location.hash;
    return !hash || hash === "#download" || hash === "#top";
  }

  function homePath() {
    var parts = location.pathname.split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function scrollToHero() {
    window.scrollTo(0, 0);
  }

  function resetHomeView() {
    if (location.hash && !isHeroEntry()) {
      history.replaceState(null, "", homePath());
    }
    scrollToHero();
  }

  function onHomeArrival() {
    if (isHeroEntry()) {
      scrollToHero();
    }
  }

  document.addEventListener("DOMContentLoaded", onHomeArrival);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted || isHeroEntry()) {
      onHomeArrival();
    }
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-home-top]");
    if (!link) {
      return;
    }

    var href = link.getAttribute("href") || "";
    if (href.indexOf("#") !== -1) {
      return;
    }

    var onHomePage =
      /index\.html$/i.test(location.pathname) ||
      location.pathname.endsWith("/");

    if (!onHomePage) {
      return;
    }

    event.preventDefault();
    resetHomeView();
  });
})();
