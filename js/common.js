function toggleNav() {
  var nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

function closeNav() {
  var nav = document.getElementById('navLinks');
  if (nav) nav.classList.remove('open');
}
