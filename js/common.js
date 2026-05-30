function setNavOpen(isOpen) {
  var nav = document.getElementById('navLinks');
  var btn = document.getElementById('hamburger');
  if (nav) nav.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  if (btn) {
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }
}

function toggleNav() {
  var navLinks = document.getElementById('navLinks');
  setNavOpen(navLinks ? !navLinks.classList.contains('open') : false);
}

function closeNav() {
  setNavOpen(false);
}

document.addEventListener('DOMContentLoaded', function () {
  var navLinks = document.getElementById('navLinks');
  var navBar = document.querySelector('nav');
  var btn = document.getElementById('hamburger');

  if (navBar) {
    navBar.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      if (e.target === navBar || e.target === navLinks) closeNav();
    });
  }

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleNav();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
    }
  });
});
