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
  function clearErrors() { document.querySelectorAll('.error').forEach(e => (e.textContent = '')); }

  function validate() {
    clearErrors();
    let valid = true;
    const requiredIds = [
      'mayoreo_lead_serio',
      'mayoreo_productos_interes',
      'mayoreo_precios_protocolo',
      'mayoreo_cotizacion_proceso',
      'menudeo_contado_flujo',
      'menudeo_credito_terminos',
      'oper_sucursales_protocolo',
      'oper_politicas_devolucion',
      'msg_bienvenida_1'
    ];
    requiredIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) { showError(id, 'Requerido'); valid = false; }
    });
    return valid;
  }

  function collectData() {
    const data = {
      tipo: 'cuestionario_procesos_negocio',
      secciones: {
        mayoreo: {
          leadSerio: document.getElementById('mayoreo_lead_serio').value.trim(),
          productosInteres: document.getElementById('mayoreo_productos_interes').value.trim(),
          protocoloPrecios: document.getElementById('mayoreo_precios_protocolo').value.trim(),
          procesoCotizacion: document.getElementById('mayoreo_cotizacion_proceso').value.trim()
        },
        menudeo: {
          contadoFlujo: document.getElementById('menudeo_contado_flujo').value.trim(),
          creditoTerminos: document.getElementById('menudeo_credito_terminos').value.trim()
        },
        operaciones: {
          sucursalesProtocolo: document.getElementById('oper_sucursales_protocolo').value.trim(),
          politicasDevolucion: document.getElementById('oper_politicas_devolucion').value.trim()
        },
        mensajes: {
          bienvenida1: document.getElementById('msg_bienvenida_1').value.trim(),
          bienvenida2: document.getElementById('msg_bienvenida_2').value.trim() || null,
          bienvenida3: document.getElementById('msg_bienvenida_3').value.trim() || null
        }
      },
      meta: { source: 'cuestionario_procesos', timestamp: new Date().toISOString() }
    };
    try { data.briefToken = window.BRIEF_TOKEN || null; } catch (_) {}
    return data;
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
      } catch (e) { lastError = e; }
    }
    throw lastError || new Error('No se pudo enviar a ningún endpoint');
  }

  function openGracias() { modalGracias.classList.add('active'); }
  modalGracias.addEventListener('click', (e) => { if (e.target === modalGracias) modalGracias.classList.remove('active'); });

  document.getElementById('btnEnviar').addEventListener('click', async () => {
    if (!validate()) return;
    const payload = collectData();
    try {
      statusEnvio.textContent = 'Enviando…';
      await postToFirstAvailable(WEBHOOK_URLS, payload);
      statusEnvio.textContent = 'Enviado';
      try { if (payload.briefToken) { localStorage.setItem('briefUsed:' + payload.briefToken, '1'); } } catch (_) {}
      openGracias();
    } catch (err) {
      statusEnvio.textContent = 'Error al enviar: ' + (err && err.message ? err.message : 'ver consola');
      console.error('Envio POST fallido:', err);
    }
  });
})();


