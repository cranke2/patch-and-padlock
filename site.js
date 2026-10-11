// Theme: follow the device setting unless the visitor has picked one with the button.
(function () {
  var KEY = "pp-theme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(theme) { document.documentElement.setAttribute("data-theme", theme); }
  apply(saved() || (media.matches ? "dark" : "light"));
  media.addEventListener("change", function (e) { if (!saved()) apply(e.matches ? "dark" : "light"); });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function label(btn) {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    btn.title = btn.getAttribute("aria-label");
  }

  // Smooth open and close for the FAQ sections.
  function animateDetails(d) {
    var summary = d.querySelector("summary");
    var anim = null;
    summary.addEventListener("click", function (e) {
      if (reduce) return;
      e.preventDefault();
      if (anim) anim.cancel();
      var start = d.offsetHeight;
      var opening = !d.open;
      if (opening) d.open = true;
      var end = opening ? d.scrollHeight : summary.offsetHeight + 20;
      d.style.height = start + "px";
      anim = d.animate({ height: [start + "px", end + "px"] }, { duration: 300, easing: "ease" });
      anim.onfinish = function () { if (!opening) d.open = false; d.style.height = ""; anim = null; };
      anim.oncancel = function () { d.style.height = ""; };
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      label(btn);
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        label(btn);
      });
    }
    document.querySelectorAll("details").forEach(animateDetails);
  });

  // Questions fade up as they scroll into view.
  window.revealOnScroll = function (els) {
    if (reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var t = en.target; t.classList.add("in"); io.unobserve(t); setTimeout(function () { t.style.transitionDelay = ""; }, 800); }
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
  };
})();
