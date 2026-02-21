(function () {
  var mount = document.getElementById("navbar");
  var mobileBreakpoint = 780;
  if (!mount) {
    return;
  }

  function isHomePage() {
    var page = window.location.pathname.split("/").pop().toLowerCase();
    return page === "" || page === "index.html";
  }

  function applyLinks() {
    var onHome = isHomePage();

    var sectionLinks = mount.querySelectorAll("[data-section]");
    sectionLinks.forEach(function (link) {
      var section = link.getAttribute("data-section");
      link.setAttribute("href", onHome ? "#" + section : "index.html#" + section);
    });

    var homeLink = mount.querySelector("[data-home-link]");
    if (homeLink) {
      homeLink.setAttribute("href", onHome ? "#top" : "index.html#top");
    }
  }

  function setActiveLink(sectionId) {
    var sectionLinks = mount.querySelectorAll("[data-section]");
    sectionLinks.forEach(function (link) {
      var id = link.getAttribute("data-section");
      link.classList.toggle("active", id === sectionId);
    });
  }

  function setBrandActive(isActive) {
    var brand = mount.querySelector("[data-home-link]");
    if (!brand) {
      return;
    }
    brand.classList.toggle("active-brand", isActive);
  }

  function setupSectionHighlighting() {
    if (!isHomePage()) {
      setActiveLink("");
      setBrandActive(false);
      return;
    }

    var links = mount.querySelectorAll("[data-section]");
    var sections = Array.prototype.map.call(links, function (link) {
      var id = link.getAttribute("data-section");
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length) {
      return;
    }

    var lastScrollY = window.scrollY || window.pageYOffset || 0;

    function getNavbarHeight() {
      var nav = mount.querySelector(".navbar");
      return nav ? nav.offsetHeight : 72;
    }

    function updateActiveFromScroll() {
      var currentScrollY = window.scrollY || window.pageYOffset || 0;
      var isScrollingDown = currentScrollY >= lastScrollY;
      var triggerOffset = isScrollingDown ? 36 : 12;
      var firstSectionTop = sections[0].offsetTop - getNavbarHeight() - triggerOffset;

      if (currentScrollY < firstSectionTop) {
        setBrandActive(true);
        setActiveLink("");
        lastScrollY = currentScrollY;
        return;
      }

      var markerY = currentScrollY + getNavbarHeight() + triggerOffset;
      var activeId = sections[0].id;
      var doc = document.documentElement;
      var atBottom = currentScrollY + window.innerHeight >= doc.scrollHeight - 2;

      if (atBottom) {
        activeId = sections[sections.length - 1].id;
      } else {
        sections.forEach(function (section) {
          if (section.offsetTop <= markerY) {
            activeId = section.id;
          }
        });
      }

      setBrandActive(false);
      setActiveLink(activeId);
      lastScrollY = currentScrollY;
    }

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        var id = link.getAttribute("data-section");
        setBrandActive(false);
        setActiveLink(id);
      });
    });

    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    window.addEventListener("hashchange", updateActiveFromScroll);
    updateActiveFromScroll();
  }

  function syncBodyOffset() {
    var nav = mount.querySelector(".navbar");
    if (!nav) {
      return;
    }

    document.documentElement.style.setProperty("--navbar-height", nav.offsetHeight + "px");
    document.body.style.paddingTop = nav.offsetHeight + "px";
  }

  function setupMobileMenu() {
    var toggle = mount.querySelector(".navbar-toggle");
    var links = mount.querySelector(".navbar-links");
    var menu = mount.querySelector(".navbar-menu");
    if (!toggle || !links || !menu) {
      return;
    }

    function isMobile() {
      return window.matchMedia("(max-width: " + mobileBreakpoint + "px)").matches;
    }

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (isMobile()) {
          closeMenu();
        }
      });
    });

    window.addEventListener("resize", function () {
      if (!isMobile()) {
        closeMenu();
      }
    });
  }

  fetch("navbar.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      mount.innerHTML = html;
      applyLinks();
      syncBodyOffset();
      setupSectionHighlighting();
      setupMobileMenu();
      window.addEventListener("resize", syncBodyOffset);
    })
    .catch(function (error) {
      console.error("Failed to load navbar:", error);
    });
})();


