function openLightbox(src, alt) {
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  img.src = src;
  img.alt = alt || 'Enlarged photo';
  if (cap) {
    cap.hidden = true;
    cap.innerHTML = '';
  }
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lightbox-close').focus();
}

function openAttireLightbox(src, alt, title, subtitle) {
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  img.src = src;
  img.alt = alt || title || 'Attire guide';
  if (cap) {
    cap.innerHTML =
      '<p class="lightbox-caption-title">' + title + '</p>' +
      '<p class="lightbox-caption-sub">' + subtitle + '</p>';
    cap.hidden = false;
  }
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lightbox-close').focus();
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  var cap = document.getElementById('lightbox-caption');
  lb.hidden = true;
  document.body.style.overflow = '';
  var img = document.getElementById('lightbox-img');
  img.src = '';
  img.alt = '';
  if (cap) {
    cap.hidden = true;
    cap.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lb.hidden) closeLightbox();
  });
});
