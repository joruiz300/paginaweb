(function(){
  const WEBHOOK_URLS = [
    '/api/formulario',
    'https://dev-n8n.sukhee.mx/webhook/formulario'
  ];

  const statusEnvio = document.getElementById('statusEnvio');
  const modalGracias = document.getElementById('modalGracias');

  function showError(id, message) {
    const el = document.querySelector(`.error[data-error-for="${id}"]`);
    if (el) el.textContent = message || '';
  }

  function clearErrors() {
    document.querySelectorAll('.error').forEach(e => (e.textContent = ''));
  }

  function validate() {
    clearErrors();
    let valid = true;
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const objetivo = document.getElementById('objetivo');

    if (!nombre.value.trim()) { showError('nombre', 'Requerido'); valid = false; }
    if (!email.value.trim()) { showError('email', 'Requerido'); valid = false; }
    if (!objetivo.value.trim()) { showError('objetivo', 'Requerido'); valid = false; }

    return valid;
  }

  function collectData() {
    const payload = {
      contacto: {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim() || null,
        empresa: document.getElementById('empresa').value.trim() || null
      },
      proyecto: {
        objetivo: document.getElementById('objetivo').value.trim(),
        publico: document.getElementById('publico').value.trim() || null,
        servicio: document.getElementById('servicio').value.trim() || null,
        presupuesto: document.getElementById('presupuesto').value || null,
        plazo: document.getElementById('plazo').value || null,
        canal: document.getElementById('canal').value || null,
        referencia: document.getElementById('referencia').value || null,
        comentarios: document.getElementById('comentarios').value.trim() || null
      },
      consent: {
        privacidad: !!document.getElementById('aceptaPrivacidad').checked
      },
      meta: {
        source: 'formulario_preguntas',
        timestamp: new Date().toISOString()
      }
    };
    try { payload.briefToken = window.BRIEF_TOKEN || null; } catch (_) {}
    return payload;
  }

  async function postToFirstAvailable(urls, payload) {
    let lastError;
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) return response;
        lastError = new Error('Solicitud no OK: ' + response.status);
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError || new Error('No se pudo enviar a ningún endpoint');
  }

  function openGracias() { modalGracias.classList.add('active'); }

  modalGracias.addEventListener('click', (e) => {
    if (e.target === modalGracias) modalGracias.classList.remove('active');
  });

  document.getElementById('btnEnviar').addEventListener('click', async () => {
    if (!validate()) return;
    const data = collectData();
    try {
      statusEnvio.textContent = 'Enviando…';
      await postToFirstAvailable(WEBHOOK_URLS, data);
      statusEnvio.textContent = 'Enviado';
      try { if (data.briefToken) { localStorage.setItem('briefUsed:' + data.briefToken, '1'); } } catch (_) {}
      openGracias();
    } catch (err) {
      statusEnvio.textContent = 'Error al enviar: ' + (err && err.message ? err.message : 'ver consola');
      console.error('Envio POST fallido:', err);
    }
  });
})();


