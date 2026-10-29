document.documentElement.classList.add('js');

// Library photos load from Wikimedia; a picture that fails is removed so the slot's wash shows instead.
document.querySelectorAll('[data-slot] img').forEach((i) => {
  if (i.complete && !i.naturalWidth) i.remove();
  else i.addEventListener('error', () => i.remove(), { once: true });
});

// Close the mobile menu on Escape and after following an in-page link.
const menu = document.querySelector('.menu');
if (menu) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { menu.open = false; }));
}

// Dropdowns: Escape moves focus back to the top-level link, which closes the panel.
document.querySelectorAll('.nav__item').forEach((item) => {
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') item.querySelector('.nav__link').focus();
  });
});

// Contact form: preselect the topic from ?topic=, validate, and post to data-endpoint once one is set.
const form = document.querySelector('form[data-endpoint]');
if (form) {
  const topic = new URLSearchParams(location.search).get('topic');
  const select = form.querySelector('#topic');
  if (topic && select && [...select.options].some((o) => o.value === topic)) select.value = topic;

  const status = form.querySelector('.form__status');
  const messages = {
    name: 'Write your name so we know who to reply to.',
    email: 'That address looks incomplete. Write it as name@example.com.',
    message: 'Tell us what you are shipping, even in a line.',
  };
  const check = (input) => {
    const ok = input.checkValidity();
    const err = form.querySelector(`#${input.id}-error`);
    input.toggleAttribute('aria-invalid', !ok);
    if (err) err.textContent = ok ? '' : messages[input.name] || 'Fill in this field.';
    return ok;
  };
  form.querySelectorAll('[required]').forEach((input) => input.addEventListener('blur', () => { if (input.value) check(input); }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('[required]')].filter((input) => !check(input));
    if (bad.length) { bad[0].focus(); status.textContent = ''; return; }
    if (!form.dataset.endpoint) {
      status.textContent = 'Nothing was sent: this form is not connected yet. Please email us instead.';
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    status.textContent = 'Sending…';
    fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        status.textContent = `Thank you. We will reply to ${form.email.value.trim()}.`;
        form.reset();
      })
      .catch(() => { status.textContent = 'That did not go through. Try again in a minute, or email us.'; })
      .finally(() => { btn.removeAttribute('aria-busy'); btn.disabled = false; });
  });
}
