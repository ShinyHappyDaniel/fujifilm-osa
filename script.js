// FUJIFILM X Summit AW – OSA
// Formulärlogik. Svaren sparas i databasen via db.js. Ett svar per e-postadress:
// svarar samma adress igen skrivs det gamla svaret över.

(function () {
  var form = document.getElementById('rsvp-form');
  var fields = document.getElementById('rsvp-fields');
  var closed = document.getElementById('rsvp-closed');
  var extra = document.getElementById('attend-extra');
  var submitBtn = document.getElementById('rsvp-submit');
  var formError = document.getElementById('rsvp-error');
  var thanks = document.getElementById('rsvp-thanks');
  var thanksTitle = document.getElementById('thanks-title');
  var thanksBody = document.getElementById('thanks-body');
  var resetBtn = document.getElementById('rsvp-reset');

  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var RULES = {
    fname: function (v) { return v ? '' : 'Fyll i ditt förnamn.'; },
    lname: function (v) { return v ? '' : 'Fyll i ditt efternamn.'; },
    email: function (v) {
      if (!v) return 'Fyll i din e-postadress.';
      return EMAIL.test(v) ? '' : 'Fyll i en e-postadress, till exempel namn@exempel.se.';
    }
  };

  function attending() {
    return form.querySelector('input[name="attend"]:checked').value === 'yes';
  }

  // Visa gäst, porträtt och nyheter bara om man kommer.
  function syncExtra() {
    extra.hidden = !attending();
  }

  function validate(name) {
    var input = form.elements[name];
    var message = RULES[name](input.value.trim());
    var error = document.getElementById(name + '-error');
    error.textContent = message;
    error.hidden = !message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', name + '-error');
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
    return !message;
  }

  function showFormError(message) {
    formError.textContent = message || '';
    formError.hidden = !message;
  }

  function setBusy(busy) {
    submitBtn.disabled = busy;
    submitBtn.setAttribute('aria-busy', busy ? 'true' : 'false');
    submitBtn.textContent = busy ? 'Skickar …' : 'Skicka svar';
  }

  function showClosed() {
    fields.hidden = true;
    closed.hidden = false;
  }

  function showThanks(kommer) {
    if (kommer) {
      thanksTitle.textContent = 'Vi ses på Studio Perra';
      thanksBody.textContent = 'Dörrarna öppnar 18:00 onsdagen den 2 december på Maria Skolgata 83.';
    } else {
      thanksTitle.textContent = 'Tråkigt att du inte kan komma';
      thanksBody.textContent = 'Tack för att du hörde av dig. Vi hoppas att vi ses en annan gång.';
    }
    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  Array.prototype.forEach.call(form.querySelectorAll('input[name="attend"]'), function (radio) {
    radio.addEventListener('change', syncExtra);
  });
  syncExtra();

  Object.keys(RULES).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('blur', function () { validate(name); });
    input.addEventListener('input', function () {
      if (input.hasAttribute('aria-invalid')) validate(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitBtn.disabled) return;
    showFormError('');

    var invalid = Object.keys(RULES).filter(function (name) { return !validate(name); });
    if (invalid.length) {
      form.elements[invalid[0]].focus();
      return;
    }

    var kommer = attending();

    // Spamfälla: fältet syns inte för människor. Är det ifyllt låtsas vi att allt gick bra.
    if (form.elements.webbplats.value) {
      showThanks(kommer);
      return;
    }

    setBusy(true);
    dbRpc('fujifilm_osa_svara', {
      p_fornamn: form.elements.fname.value.trim(),
      p_efternamn: form.elements.lname.value.trim(),
      p_epost: form.elements.email.value.trim(),
      p_kommer: kommer,
      p_gast: kommer ? form.elements.guest.value.trim() : '',
      p_portratt: kommer && form.elements.portrait.checked,
      p_nyheter: kommer && form.elements.news.checked
    }).then(function (svar) {
      setBusy(false);
      if (svar && svar.status === 'ok') showThanks(kommer);
      else if (svar && svar.status === 'stangd') showClosed();
      else showFormError('Något i svaret gick inte att spara. Kontrollera uppgifterna och försök igen.');
    }).catch(function (err) {
      console.error('Kunde inte skicka svaret:', err);
      setBusy(false);
      showFormError('Det gick inte att skicka svaret. Kontrollera uppkopplingen och försök igen.');
    });
  });

  // Uppgifterna står kvar i formuläret, ett nytt svar skriver över det gamla.
  resetBtn.addEventListener('click', function () {
    thanks.hidden = true;
    form.hidden = false;
    form.elements.fname.focus();
  });

  DB_STATUS.then(function (status) {
    if (status && status.oppen === false) showClosed();
  });
})();
