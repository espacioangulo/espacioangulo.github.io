(function () {
  const cfg = window.ESPACIO_ANGULO_CONFIG || {};
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const priceNodes = document.querySelectorAll('[data-price]');
  priceNodes.forEach((node) => (node.textContent = cfg.sessionPrice || '60 €'));

  const form = document.querySelector('#booking-form');
  const status = document.querySelector('#form-status');
  const tagTrack = document.querySelector('#tag-track');
  const tagScroll = document.querySelector('#tag-scroll');
  let agenda = { ocupados: [], etiquetas: [] };
  let autoScrollFrame = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let pauseUntil = 0;

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status ' + (type || '');
  }

  function isPlaceholder(value) {
    return !value || value.includes('TU_ENDPOINT') || value.includes('TU_PAYMENT_LINK');
  }

  function requestCode(date, time) {
    const cleanDate = String(date || '').replaceAll('-', '');
    const cleanTime = String(time || '').replace(':', '');
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    const stamp = Date.now().toString(36).slice(-4).toUpperCase();
    return `EA-${cleanDate}-${cleanTime}-${stamp}${rand}`;
  }

  function normalizeSlot(date, time) {
    if (!date || !time) return '';
    return `${date}T${time}`;
  }

  function slotOccupied(date, time) {
    const slot = normalizeSlot(date, time);
    return Boolean(slot && Array.isArray(agenda.ocupados) && agenda.ocupados.includes(slot));
  }

  function appendStripeParams(link, params) {
    const url = new URL(link);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  function buildPayload(formData, id) {
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.codigo_solicitud = id;
    data._subject = `Nueva solicitud — Espacio Ángulo — ${id}`;
    data._language = 'es';
    return data;
  }

  async function loadAgenda() {
    const path = cfg.agendaPath || 'data/agenda.json';
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (res.ok) agenda = await res.json();
    } catch (err) {
      agenda = { ocupados: [], etiquetas: [] };
    }
    renderTags();
    setupTagScroller();
  }


  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderTags() {
    if (!tagTrack) return;
    const fallback = [
      'traer el bucle', 'ordenar una decisión', 'afinar la sensibilidad',
      'pensar el aburrimiento', 'poner lenguaje', 'cambiar de perspectiva'
    ];
    const sourceTags = Array.isArray(agenda.etiquetas) && agenda.etiquetas.length ? agenda.etiquetas : fallback;
    const tags = shuffle(sourceTags);
    const full = tags.concat(tags, tags);
    tagTrack.innerHTML = full.map((tag) => `<span class="tag-pill">${escapeHTML(tag)}</span>`).join('');
  }

  function setupTagScroller() {
    if (!tagScroll || !tagTrack || autoScrollFrame) return;

    function loop() {
      const now = Date.now();
      if (!isDragging && now > pauseUntil) {
        tagScroll.scrollLeft += 0.35;
        const resetPoint = tagTrack.scrollWidth / 3;
        if (tagScroll.scrollLeft >= resetPoint) tagScroll.scrollLeft = 0;
      }
      autoScrollFrame = requestAnimationFrame(loop);
    }

    tagScroll.addEventListener('pointerdown', (event) => {
      isDragging = true;
      dragStartX = event.clientX;
      dragStartScroll = tagScroll.scrollLeft;
      tagScroll.classList.add('is-dragging');
      tagScroll.setPointerCapture(event.pointerId);
    });

    tagScroll.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      const delta = event.clientX - dragStartX;
      tagScroll.scrollLeft = dragStartScroll - delta;
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      pauseUntil = Date.now() + 1200;
      tagScroll.classList.remove('is-dragging');
    }

    tagScroll.addEventListener('pointerup', endDrag);
    tagScroll.addEventListener('pointercancel', endDrag);
    tagScroll.addEventListener('pointerleave', endDrag);
    tagScroll.addEventListener('wheel', () => { pauseUntil = Date.now() + 1600; }, { passive: true });

    loop();
  }

  function setupModals() {
    const modal = document.querySelector('#legal-modal');
    if (!modal) return;
    const title = modal.querySelector('#legal-modal-title');
    const body = modal.querySelector('#legal-modal-body');
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    const triggers = document.querySelectorAll('[data-modal-target]');

    function openModal(id) {
      const content = document.querySelector(`#${id}`);
      if (!content) return;
      title.textContent = content.dataset.title || 'Información';
      body.innerHTML = content.innerHTML;
      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
      const close = modal.querySelector('[data-modal-close]');
      if (close) close.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(trigger.dataset.modalTarget);
      });
    });
    closeButtons.forEach((button) => button.addEventListener('click', closeModal));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const date = formData.get('dia_preferido');
      const time = formData.get('hora_preferida');
      const email = formData.get('email');

      if (slotOccupied(date, time)) {
        setStatus('Ese horario no está disponible. Elige otro horario.', 'error');
        return;
      }

      const endpoint = cfg.formEndpoint;
      const paymentLink = cfg.stripePaymentLink;

      if (isPlaceholder(endpoint) || isPlaceholder(paymentLink)) {
        setStatus('Falta configurar Formspree o Stripe en assets/js/config.js.', 'error');
        return;
      }

      const id = requestCode(date, time);
      const payload = buildPayload(formData, id);
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Continuando…';
      setStatus('Registrando solicitud…', 'muted');

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('No se pudo enviar el formulario');

        sessionStorage.setItem('espacio_angulo_solicitud', JSON.stringify(payload));
        setStatus('Redirigiendo…', 'success');
        window.location.href = appendStripeParams(paymentLink, {
          client_reference_id: id,
          prefilled_email: email
        });
      } catch (err) {
        submitButton.disabled = false;
        submitButton.textContent = 'Continuar';
        setStatus('No se pudo enviar la solicitud. Inténtalo de nuevo.', 'error');
      }
    });
  }

  setupModals();
  loadAgenda();
})();
