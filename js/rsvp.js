const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6HnUjgWIgME8KhecutER4SFVyRAcgSZAnsoOUczd2AE3I8JWZKrOELZz7FVcSULq7/exec';

function selectAttend(el, val) {
  document.querySelectorAll('#rsvpForm .radio-opt').forEach(function (o) { o.classList.remove('active'); });
  el.classList.add('active');
  document.getElementById('rsvp-attend').value = val;
  var show = val === 'yes';
  document.getElementById('seats-group').style.display = show ? 'block' : 'none';
  if (!show) {
    document.getElementById('rsvp-seats').value = '';
    document.getElementById('other-guests-group').style.display = 'none';
    document.getElementById('other-guests-fields').innerHTML = '';
  } else {
    onSeatsChange();
  }
  hideRsvpError();
}

function onSeatsChange() {
  var seats = parseInt(document.getElementById('rsvp-seats').value, 10) || 0;
  var group = document.getElementById('other-guests-group');
  var container = document.getElementById('other-guests-fields');

  if (seats <= 1) {
    group.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  group.style.display = 'block';
  container.innerHTML = '';
  var otherCount = Math.min(seats - 1, 4);

  for (var i = 0; i < otherCount; i++) {
    var wrap = document.createElement('div');
    wrap.className = 'form-group';
    var label = document.createElement('label');
    label.className = 'form-label';
    label.setAttribute('for', 'other-guest-' + i);
    label.textContent = 'Guest ' + (i + 2) + ' name';
    var input = document.createElement('input');
    input.className = 'form-input other-guest-input';
    input.type = 'text';
    input.id = 'other-guest-' + i;
    input.placeholder = 'Full name';
    input.required = true;
    wrap.appendChild(label);
    wrap.appendChild(input);
    container.appendChild(wrap);
  }
}

function getOtherGuestNames() {
  return Array.from(document.querySelectorAll('.other-guest-input'))
    .map(function (el) { return el.value.trim(); })
    .filter(Boolean);
}

function showRsvpError(msg) {
  var err = document.getElementById('rsvpError');
  err.textContent = msg;
  err.style.display = 'block';
}

function hideRsvpError() {
  var err = document.getElementById('rsvpError');
  err.textContent = '';
  err.style.display = 'none';
}

function showRsvpSuccess() {
  document.getElementById('rsvpForm').style.display = 'none';
  var success = document.getElementById('rsvpSuccess');
  success.style.display = 'block';
  success.classList.add('is-visible');
}

async function submitRSVP() {
  hideRsvpError();

  var nameEl = document.getElementById('rsvp-name');
  var name = nameEl.value.trim();
  var attending = document.getElementById('rsvp-attend').value;
  var submitBtn = document.getElementById('rsvp-submit');
  var defaultBtnText = 'Send RSVP';

  nameEl.style.borderColor = '';

  if (!name) {
    nameEl.style.borderColor = 'rgba(200,100,100,0.5)';
    nameEl.focus();
    showRsvpError('Please enter your full name.');
    return;
  }

  if (!attending) {
    showRsvpError('Please let us know if you will be attending.');
    return;
  }

  if (attending === 'yes') {
    var seats = document.getElementById('rsvp-seats').value;
    if (!seats) {
      showRsvpError('Please select how many seats have been reserved for you.');
      document.getElementById('rsvp-seats').focus();
      return;
    }

    var seatsNum = parseInt(seats, 10);
    if (seatsNum > 1) {
      var otherInputs = document.querySelectorAll('.other-guest-input');
      for (var j = 0; j < otherInputs.length; j++) {
        var input = otherInputs[j];
        if (!input.value.trim()) {
          showRsvpError('Please enter the full name for each additional guest.');
          input.style.borderColor = 'rgba(200,100,100,0.5)';
          input.focus();
          return;
        }
        input.style.borderColor = '';
      }
    }
  }

  if (!RSVP_SCRIPT_URL || RSVP_SCRIPT_URL.includes('PASTE_YOUR')) {
    showRsvpError('RSVP is not configured yet. Add your Google Apps Script Web App URL to RSVP_SCRIPT_URL in js/rsvp.js.');
    return;
  }

  var payload = {
    name: name,
    attending: attending,
    seats: attending === 'yes' ? document.getElementById('rsvp-seats').value : '',
    otherGuests: attending === 'yes' ? getOtherGuestNames().join('; ') : '',
    message: document.getElementById('rsvp-message').value.trim()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    var res = await fetch(RSVP_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    var ok = res.ok;
    if (ok) {
      try {
        var data = await res.json();
        ok = data.ok !== false;
        if (!ok && data.error) {
          showRsvpError(data.error);
          return;
        }
      } catch (_) {
        /* non-JSON success is fine */
      }
    }

    if (!ok) {
      showRsvpError('Something went wrong. Please try again in a moment.');
      return;
    }

    showRsvpSuccess();
    return;
  } catch (err) {
    showRsvpError('Could not send your RSVP. Check your connection and try again.');
  } finally {
    if (document.getElementById('rsvpForm').style.display !== 'none') {
      submitBtn.disabled = false;
      submitBtn.textContent = defaultBtnText;
    }
  }
}
