// Indo-Afrik site script: route maps, menu, quote form.

/* ---------- route map ---------- */
const ORIGIN = [72.9, 19.1]; // west coast of India
const LANES = [
  [3.4, 6.5],    // West Africa
  [39.7, -4.0],  // East Africa
  [31.0, -29.8], // Southern Africa
  [31.2, 30.0],  // North Africa
  [4.5, 51.9],   // Europe
  [55.3, 25.3],  // the Gulf
  [103.8, 1.3],  // South-East Asia
  [121.5, 31.2], // East Asia
];
const COLORS = { dot: 'rgba(169, 180, 204, 0.32)', india: 'rgba(240, 74, 42, 0.95)', africa: 'rgba(255, 196, 176, 0.55)', lane: 'rgba(240, 74, 42, 0.55)', pulse: '#FF8A6B', pin: '#F04A2A', label: '#FFFFFF', labelBg: 'rgba(11, 21, 48, 0.82)', labelLine: 'rgba(255, 255, 255, 0.22)' };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function inIndia(lon, lat) { return lon > 68 && lon < 90 && lat > 7 && lat < 33 && !(lon > 85 && lat > 27); }
function inAfrica(lon, lat) { return lon > -18 && lon < 52 && lat > -35 && lat < 37 && !(lon > 35 && lat > 13) && !(lon > 43 && lat > 10); }

function makeMap(canvas, opts) {
  const ctx = canvas.getContext('2d');
  const [lon0, lon1, lat0, lat1] = opts.view;
  const dots = window.LAND_DOTS || [];
  let w = 0, h = 0, s = 1, ox = 0, oy = 0, dpr = 1, running = false, t0 = performance.now();

  const proj = (lon, lat) => [ox + (lon - lon0) * s, oy + (lat1 - lat) * s];

  function size() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const sx = w / (lon1 - lon0), sy = h / (lat1 - lat0);
    s = opts.cover ? Math.max(sx, sy) : Math.min(sx, sy);
    ox = (w - (lon1 - lon0) * s) / 2 + (opts.shiftX || 0) * w;
    oy = (h - (lat1 - lat0) * s) / 2;
  }

  // lanes as quadratic curves lifted off the straight line
  function lane(a, b) {
    const [x0, y0] = proj(a[0], a[1]), [x1, y1] = proj(b[0], b[1]);
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
    const len = Math.hypot(dx, dy), lift = Math.min(len * 0.28, 140);
    const nx = -dy / len, ny = dx / len, sign = ny > 0 ? -1 : 1;
    return [x0, y0, mx + nx * lift * sign, my + ny * lift * sign, x1, y1];
  }
  const at = (c, t) => { const u = 1 - t; return [u * u * c[0] + 2 * u * t * c[2] + t * t * c[4], u * u * c[1] + 2 * u * t * c[3] + t * t * c[5]]; };

  function pill(text, lon, lat, dx, dy) {
    const [x, y] = proj(lon, lat);
    ctx.font = '500 12px "JetBrains Mono", ui-monospace, monospace';
    const tw = ctx.measureText(text).width, pw = tw + 34, ph = 26, px = x + dx, py = y + dy;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(px, py, pw, ph, 13) : ctx.rect(px, py, pw, ph);
    ctx.fillStyle = COLORS.labelBg; ctx.fill();
    ctx.strokeStyle = COLORS.labelLine; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(px + 13, py + ph / 2, 4, 0, Math.PI * 2); ctx.fillStyle = COLORS.pin; ctx.fill();
    ctx.fillStyle = COLORS.label; ctx.textBaseline = 'middle'; ctx.fillText(text, px + 24, py + ph / 2 + 0.5);
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const r = Math.max(1, Math.min(2.2, s * 0.42));
    for (let i = 0; i < dots.length; i += 2) {
      const lon = dots[i] / 10, lat = dots[i + 1] / 10;
      if (lon < lon0 - 3 || lon > lon1 + 3 || lat < lat0 - 3 || lat > lat1 + 3) continue;
      const [x, y] = proj(lon, lat);
      ctx.fillStyle = inIndia(lon, lat) ? COLORS.india : inAfrica(lon, lat) ? COLORS.africa : COLORS.dot;
      ctx.fillRect(x - r / 2, y - r / 2, r, r);
    }
    const lanes = opts.lanes.map((d) => lane(ORIGIN, d));
    ctx.lineWidth = 1.4; ctx.strokeStyle = COLORS.lane; ctx.setLineDash([2, 5]);
    lanes.forEach((c) => { ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.quadraticCurveTo(c[2], c[3], c[4], c[5]); ctx.stroke(); });
    ctx.setLineDash([]);
    // pulses travel both ways: out from India on even lanes, back to India on odd ones
    lanes.forEach((c, i) => {
      const speed = 0.16 + (i % 3) * 0.03;
      for (const k of [0, 0.5]) {
        let p = ((reduce ? 0.35 : t * speed) + i * 0.13 + k) % 1;
        if (i % 2) p = 1 - p;
        const [x, y] = at(c, p);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(255, 138, 107, 0.9)'); g.addColorStop(1, 'rgba(255, 138, 107, 0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = COLORS.pulse; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      const [ex, ey] = [c[4], c[5]];
      ctx.fillStyle = COLORS.pin; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
    });
    const [ix, iy] = proj(ORIGIN[0], ORIGIN[1]);
    const ring = reduce ? 0.5 : (t * 0.6) % 1;
    ctx.strokeStyle = `rgba(240, 74, 42, ${1 - ring})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ix, iy, 6 + ring * 18, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = COLORS.pin; ctx.beginPath(); ctx.arc(ix, iy, 5, 0, Math.PI * 2); ctx.fill();
    if (opts.labels) { pill('India', 80, 22, 14, -34); pill('Africa', 17, 4, -30, -13); }
    if (running) requestAnimationFrame(draw);
  }

  size(); draw(performance.now());
  if (!reduce) {
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(draw);
    }).observe(canvas);
  }
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { size(); draw(performance.now()); }, 120); });
  if (document.fonts) document.fonts.ready.then(() => draw(performance.now()));
}

document.querySelectorAll('canvas[data-map]').forEach((c) => {
  const kind = c.dataset.map;
  if (kind === 'hero') makeMap(c, { view: [-28, 132, -40, 58], lanes: LANES, labels: true });
  else if (kind === 'world') makeMap(c, { view: [-170, 180, -56, 76], lanes: LANES, labels: true, cover: true });
  else makeMap(c, { view: [-170, 180, -56, 76], lanes: LANES, cover: true, shiftX: 0.18 });
});

/* ---------- mobile menu ---------- */
const menu = document.querySelector('.menu');
if (menu) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { menu.open = false; }));
}
document.querySelectorAll('.nav__item').forEach((item) => {
  item.addEventListener('keydown', (e) => { if (e.key === 'Escape') item.querySelector('.nav__link').focus(); });
});

/* ---------- quote form ---------- */
const form = document.querySelector('form[data-endpoint]');
if (form) {
  const topic = new URLSearchParams(location.search).get('topic');
  const select = form.querySelector('#topic');
  if (topic && select && [...select.options].some((o) => o.value === topic)) {
    select.value = topic;
    const mode = form.querySelector(`input[name="mode"][value="${topic}"]`);
    if (mode) mode.checked = true;
  }
  const status = form.querySelector('.form__status');
  const messages = {
    name: 'Add your name so we know who to reply to.',
    email: 'Enter an email address like name@company.com.',
    message: 'Describe the cargo in a line or two: what it is and roughly how much.',
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
      status.textContent = 'This form is not connected yet, so nothing was sent. Please use the email address on this page.';
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true; status.textContent = 'Sending your request…';
    fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        status.textContent = `Request received. We will reply to ${form.email.value.trim()}.`;
        form.reset();
      })
      .catch(() => { status.textContent = 'The request did not go through. Try again in a minute, or email us.'; })
      .finally(() => { btn.disabled = false; });
  });
}
