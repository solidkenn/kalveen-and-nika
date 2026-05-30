window.__envelopeDismissed = false;

(function () {
  var seal     = document.getElementById('envSeal');
  var envelope = document.getElementById('envelope');
  var envWrap  = document.getElementById('envWrap');
  var hint     = document.getElementById('envHint');
  var screen   = document.getElementById('envelope-screen');

  if (!screen) {
    window.__envelopeDismissed = true;
    return;
  }

  function shouldSkipEnvelope() {
    return sessionStorage.getItem('kn-envelope-seen') === '1' ||
      new URLSearchParams(window.location.search).get('skipIntro') === '1' ||
      document.documentElement.classList.contains('skip-envelope');
  }

  function goToHero() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function revealHero() {
    window.__envelopeDismissed = true;
    sessionStorage.setItem('kn-envelope-seen', '1');
    var cleanUrl = window.location.pathname + window.location.search;
    if (window.location.hash) {
      history.replaceState(null, '', cleanUrl);
    }
    goToHero();
    requestAnimationFrame(goToHero);
    setTimeout(goToHero, 0);
    setTimeout(goToHero, 50);
    setTimeout(goToHero, 150);
  }

  function skipEnvelopeIntro() {
    window.__envelopeDismissed = true;
    screen.style.display = 'none';
    document.body.classList.remove('envelope-active');
    if (new URLSearchParams(window.location.search).get('skipIntro') === '1') {
      history.replaceState(null, '', window.location.pathname + (window.location.hash || '#home'));
    }
    goToHero();
    requestAnimationFrame(goToHero);
    setTimeout(goToHero, 0);
  }

  if (shouldSkipEnvelope()) {
    skipEnvelopeIntro();
    return;
  }

  if (!seal || !envelope) return;

  goToHero();

  function spawnParticles(cx, cy) {
    var colors = ['#4d6d86', '#6d9170', '#aec6cf', '#c8d8e4', '#f0e4c8'];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('div');
      p.className = 'env-particle';
      var angle = (i / 18) * Math.PI * 2;
      var dist  = 50 + Math.random() * 80;
      p.style.left = cx + 'px';
      p.style.top  = cy + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.style.animationDelay = (Math.random() * 0.15) + 's';
      document.body.appendChild(p);
      (function (el) { setTimeout(function () { el.remove(); }, 1500); })(p);
    }
  }

  seal.addEventListener('click', function (e) {
    if (envelope.classList.contains('open')) return;

    spawnParticles(e.clientX, e.clientY);

    if (envWrap) envWrap.style.animation = 'none';
    if (hint) hint.classList.add('hidden');

    envelope.classList.add('open');

    setTimeout(function () {
      screen.classList.add('env-screen--closing');
      setTimeout(function () {
        screen.style.display = 'none';
        document.body.classList.remove('envelope-active');
        revealHero();
      }, 750);
    }, 1700);
  });
})();

function updateCountdown() {
  var target = new Date('2026-04-18T14:00:00+08:00');
  var now = new Date();
  var diff = target - now;
  var daysEl = document.getElementById('cd-days');
  if (!daysEl) return;

  if (diff <= 0) {
    daysEl.textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent = '0';
    document.getElementById('cd-secs').textContent = '0';
    return;
  }
  var days = Math.floor(diff / 86400000);
  var hours = Math.floor((diff % 86400000) / 3600000);
  var mins = Math.floor((diff % 3600000) / 60000);
  var secs = Math.floor((diff % 60000) / 1000);
  daysEl.textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

(function () {
  function scrollToTarget() {
    if (!window.__envelopeDismissed) return;
    if (!window.location.hash) return;
    var id = window.location.hash.slice(1);
    var el = document.getElementById(id);
    if (!el) return;
    var nav = document.querySelector('nav');
    var navHeight = nav ? nav.offsetHeight : 0;
    var top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top: top, behavior: 'auto' });
  }
  window.addEventListener('load', function () {
    setTimeout(scrollToTarget, 300);
    setTimeout(scrollToTarget, 800);
  });
  window.addEventListener('hashchange', scrollToTarget);
})();
