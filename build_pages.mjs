import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const base = dirname(fileURLToPath(import.meta.url));
const frag = (name) => readFileSync(join(base, 'fragments', name), 'utf8');

const src = execSync('git show HEAD:index.html', { cwd: base, encoding: 'utf8' });
const lines = src.split(/\r?\n/).map((l, i) => (i === 0 && l.startsWith('\ufeff') ? l.slice(1) : l));

function rng(a, b) {
  return lines.slice(a - 1, b).join('\n') + '\n';
}

const nav = `<!-- NAV -->
<nav>
  <a href="index.html?skipIntro=1" class="nav-monogram">K & N</a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html" aria-current="page" onclick="closeNav()">Home</a></li>
    <li><a href="details.html" onclick="closeNav()">Details</a></li>
    <li><a href="gallery.html" onclick="closeNav()">Gallery</a></li>
    <li><a href="share.html" onclick="closeNav()">Share Photos</a></li>
    <li><a href="entourage.html" onclick="closeNav()">Entourage</a></li>
    <li><a href="rsvp.html" onclick="closeNav()">RSVP</a></li>
  </ul>
  <div class="hamburger" id="hamburger" onclick="toggleNav()">
    <span></span><span></span><span></span>
  </div>
</nav>
`;

const headCommon = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
`;

const footer = rng(1763, 1768);
const lightbox = frag('lightbox.html');
const ornament = '<div class="ornament">· · ·</div>\n';

function page(title, active, bodyClass, content, scripts) {
  let n = nav.replace('aria-current="page" ', '');
  if (active !== 'home') {
    n = n.replace(`href="${active}.html"`, `href="${active}.html" aria-current="page"`);
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${headCommon}
</head>
<body class="${bodyClass}">

${n}

${content}

${footer}

${scripts}
</body>
</html>
`;
}

const detailsContent =
  rng(1493, 1560) + ornament + frag('attire.html') + ornament + rng(1609, 1642);

writeFileSync(
  join(base, 'details.html'),
  page(
    'Wedding Details — Kalveen & Nika',
    'details',
    'page-inner',
    detailsContent + '\n' + lightbox,
    '<script src="js/common.js"></script>\n<script src="js/gallery.js"></script>\n'
  )
);

writeFileSync(
  join(base, 'gallery.html'),
  page(
    'Gallery — Kalveen & Nika',
    'gallery',
    'page-inner',
    rng(1643, 1694) + '\n' + lightbox,
    '<script src="js/common.js"></script>\n<script src="js/gallery.js"></script>\n'
  )
);

writeFileSync(
  join(base, 'entourage.html'),
  page(
    'Wedding Entourage — Kalveen & Nika',
    'entourage',
    'page-inner',
    frag('entourage.html'),
    '<script src="js/common.js"></script>\n'
  )
);

writeFileSync(
  join(base, 'rsvp.html'),
  page(
    'RSVP — Kalveen & Nika',
    'rsvp',
    'page-inner',
    frag('rsvp.html'),
    '<script src="js/common.js"></script>\n<script src="js/rsvp.js"></script>\n'
  )
);

const head = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kalveen & Nika — April 18, 2026</title>
<script>
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  (function () {
    var skip = sessionStorage.getItem('kn-envelope-seen') === '1' ||
      new URLSearchParams(window.location.search).get('skipIntro') === '1';
    if (skip) document.documentElement.classList.add('skip-envelope');
  })();
</script>
<link rel="preload" as="image" href="images/hero-couple.png">
${headCommon}
</head>
<body class="envelope-active">
`;

let share = rng(1705, 1742);
share = share.replace(
  '</button>\n  </div>\n</section>',
  `</button>

    <p style="text-align:center;margin-top:1.25rem;font-size:0.78rem;letter-spacing:0.1em;">
      <a href="share.html" style="color:var(--accent-sage);text-decoration:none;opacity:0.85;">Open full upload page →</a>
    </p>
  </div>
</section>`
);

const index =
  head +
  frag('envelope.html') +
  nav +
  frag('hero.html') +
  rng(1470, 1491) +
  frag('story.html') +
  ornament +
  share +
  ornament +
  frag('rsvp.html') +
  footer +
  '<script src="js/common.js"></script>\n' +
  '<script src="js/home.js"></script>\n' +
  '<script src="js/rsvp.js"></script>\n' +
  '<script src="js/filestack.js"></script>\n' +
  '<script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>\n' +
  '</body>\n</html>\n';

writeFileSync(join(base, 'index.html'), index);
console.log('index lines', index.split('\n').length);
console.log('ok', index.includes('envSeal') && index.includes('rsvpForm'));
