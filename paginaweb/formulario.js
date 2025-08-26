/* Formulario multipaso: lógica de navegación, validación, recolección y envío POST */
(function () {
  const WEBHOOK_URLS = [
    '/api/formulario',
    'https://dev-n8n.sukhee.mx/webhook/formulario'
  ];

  const sections = Array.from(document.querySelectorAll('.section'));
  const stepPills = Array.from(document.querySelectorAll('#stepPills .step-pill'));
  const progressBar = document.getElementById('progressBar');
  const statusEnvio = document.getElementById('statusEnvio');
  const modalGracias = document.getElementById('modalGracias');
  let currentStep = 0;

  function setStep(idx) {
    currentStep = Math.max(0, Math.min(sections.length - 1, idx));
    sections.forEach((s, i) => s.classList.toggle('active', i === currentStep));
    stepPills.forEach((p, i) => p.classList.toggle('active', i === currentStep));
    progressBar.style.width = ((currentStep) / (sections.length - 1)) * 100 + '%';
  }

  function showError(id, message) {
    const el = document.querySelector(`.error[data-error-for="${id}"]`);
    if (el) el.textContent = message || '';
  }

  // Navegación
  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    setStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  document.querySelectorAll('[data-prev]').forEach(btn => btn.addEventListener('click', () => {
    setStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  // Campos dinámicos: Campos extra (CRM)
  const camposExtraWrap = document.getElementById('camposExtra');
  const campoExtraInput = document.getElementById('campoExtraInput');
  const camposBaseWrap = document.getElementById('camposBase');
  document.getElementById('agregarCampoExtra').addEventListener('click', () => {
    const value = (campoExtraInput.value || '').trim();
    if (!value) return;
    const chip = createChip(value, () => chip.remove());
    chip.dataset.extra = value;
    camposExtraWrap.appendChild(chip);
    campoExtraInput.value = '';
  });

  // Permitir eliminar chips base predefinidos
  if (camposBaseWrap) {
    camposBaseWrap.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('remove')) {
        const chip = e.target.closest('.chip');
        if (chip) chip.remove();
      }
    });
  }

  function createChip(text, onRemove) {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = text + ' ';
    const btn = document.createElement('button');
    btn.className = 'remove';
    btn.type = 'button';
    btn.textContent = '×';
    btn.addEventListener('click', onRemove);
    span.appendChild(btn);
    return span;
  }

  // Usuarios y agentes dinámicos
  const usuariosWrap = document.getElementById('usuariosWrap');
  document.getElementById('agregarUsuario').addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'grid grid-3 user-row';
    row.innerHTML = '<input type="text" placeholder="Nombre" data-user="nombre" required />\
                     <input type="email" placeholder="Email" data-user="email" required />\
                     <select data-user="rol">\
                       <option>Ventas Mayoreo<\/option>\
                       <option>Ventas Menudeo<\/option>\
                       <option>Soporte y Reparaciones<\/option>\
                       <option>General<\/option>\
                       <option>Admin<\/option>\
                     <\/select>';
    usuariosWrap.appendChild(row);
  });

  // Equipos dinámicos
  const equiposWrap = document.getElementById('equiposWrap');
  const nuevoEquipo = document.getElementById('nuevoEquipo');
  document.getElementById('agregarEquipo').addEventListener('click', () => {
    const name = (nuevoEquipo.value || '').trim();
    if (!name) return;
    const row = document.createElement('div');
    row.className = 'row';
    const id = 'eq_' + name.toLowerCase().replace(/\s+/g, '_');
    row.innerHTML = `<input type="checkbox" checked data-equipo="${name}" id="${id}" /><label for="${id}">${name}<\/label>`;
    equiposWrap.appendChild(row);
    nuevoEquipo.value = '';
  });

  // Etiquetas dinámicas
  const etiquetasChips = document.getElementById('etiquetasChips');
  etiquetasChips.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('remove')) {
      const chip = e.target.closest('.chip');
      chip && chip.remove();
    }
  });
  document.getElementById('agregarEtiqueta').addEventListener('click', () => {
    const input = document.getElementById('nuevaEtiqueta');
    const value = (input.value || '').trim();
    if (!value) return;
    const chip = createChip(value, () => chip.remove());
    chip.dataset.tag = value;
    etiquetasChips.appendChild(chip);
    input.value = '';
  });

  // Triggers dinámicos
  const triggersChips = document.getElementById('triggersChips');
  triggersChips.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('remove')) {
      const chip = e.target.closest('.chip');
      chip && chip.remove();
    }
  });
  document.getElementById('agregarTrigger').addEventListener('click', () => {
    const input = document.getElementById('nuevoTrigger');
    const value = (input.value || '').trim();
    if (!value) return;
    const chip = createChip(value, () => chip.remove());
    chip.dataset.trigger = value;
    triggersChips.appendChild(chip);
    input.value = '';
  });

  // Embudo: agregar/eliminar filas
  const tablaEmbudo = document.getElementById('tablaEmbudo');
  document.getElementById('agregarFilaEmbudo').addEventListener('click', () => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td><input type="text" value="Nueva etapa" data-etapa="nombre" /><\/td>\
                    <td><input type="text" value="Definición" data-etapa="definicion" /><\/td>\
                    <td><select data-etapa="quien">\
                          <option>Automático (Bot)<\/option>\
                          <option>Manual (Agente)<\/option>\
                        <\/select><\/td>\
                    <td><button class="btn secondary" data-remove-row>Eliminar<\/button><\/td>';
    tablaEmbudo.querySelector('tbody').appendChild(tr);
  });
  tablaEmbudo.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-row]');
    if (btn) {
      const tr = btn.closest('tr');
      if (tr && tablaEmbudo.querySelectorAll('tbody tr').length > 1) {
        tr.remove();
      }
    }
  });

  // Validación por paso
  function validateStep(step) {
    let valid = true;
    // limpiar mensajes
    document.querySelectorAll('.error').forEach(e => (e.textContent = ''));
    if (step === 0) {
      const metrica = document.getElementById('metricaPrincipal');
      const definicion = document.getElementById('definicionLead');
      if (!metrica.value.trim()) { showError('metricaPrincipal', 'Este campo es requerido.'); valid = false; }
      if (!definicion.value.trim()) { showError('definicionLead', 'Este campo es requerido.'); valid = false; }
    }
    if (step === 2) {
      // al menos un usuario válido
      const rows = usuariosWrap.querySelectorAll('.user-row');
      let hasValid = false;
      rows.forEach(r => {
        const nombre = r.querySelector('[data-user="nombre"]').value.trim();
        const email = r.querySelector('[data-user="email"]').value.trim();
        if (nombre && email) hasValid = true;
      });
      if (!hasValid) { showError('usuarios', 'Agrega al menos un usuario con nombre y email.'); valid = false; }
    }
    if (step === 3) {
      // al menos una fila de embudo con nombre
      const rows = tablaEmbudo.querySelectorAll('tbody tr');
      let ok = false;
      rows.forEach(tr => {
        const nombre = tr.querySelector('[data-etapa="nombre"]').value.trim();
        if (nombre) ok = true;
      });
      if (!ok) { showError('embudo', 'Define al menos una etapa.'); valid = false; }
    }
    return valid;
  }

  // Recolección de datos
  function collectData() {
    // Sección 1
    const vision = {
      metricaPrincipal: document.getElementById('metricaPrincipal').value.trim(),
      definicionLeadCalificado: document.getElementById('definicionLead').value.trim(),
      priorizacion: {
        mayoreo: document.getElementById('prioMayoreo').value,
        menudeo: document.getElementById('prioMenudeo').value,
        reparacion: document.getElementById('prioReparacion').value
      }
    };
    // Sección 2
    const camposBase = Array.from(document.querySelectorAll('#camposBase .chip')).map(ch => ch.dataset.base || ch.textContent.replace('×', '').trim());
    const camposExtra = Array.from(document.querySelectorAll('#camposExtra .chip')).map(ch => ch.dataset.extra || ch.textContent.replace('×', '').trim());
    const crm = { camposBase, camposExtra };
    // Sección 3
    const usuarios = Array.from(document.querySelectorAll('#usuariosWrap .user-row')).map(r => ({
      nombre: r.querySelector('[data-user="nombre"]').value.trim(),
      email: r.querySelector('[data-user="email"]').value.trim(),
      rol: r.querySelector('[data-user="rol"]').value
    })).filter(u => u.nombre && u.email);
    const equipos = Array.from(document.querySelectorAll('#equiposWrap [data-equipo]'))
      .filter(i => i.checked).map(i => i.getAttribute('data-equipo'));
    const etiquetas = Array.from(document.querySelectorAll('#etiquetasChips .chip'))
      .map(ch => ch.dataset.tag || ch.textContent.replace('×', '').trim());
    const chatwoot = { usuarios, equipos, etiquetas };
    // Sección 4
    const etapas = Array.from(document.querySelectorAll('#tablaEmbudo tbody tr')).map(tr => ({
      etapa: tr.querySelector('[data-etapa="nombre"]').value.trim(),
      definicion: tr.querySelector('[data-etapa="definicion"]').value.trim(),
      actualiza: tr.querySelector('[data-etapa="quien"]').value
    })).filter(e => e.etapa);
    const embudo = { etapas };
    // Sección 5
    const triggers = Array.from(document.querySelectorAll('#triggersChips .chip')).map(ch => ch.dataset.trigger || ch.textContent.replace('×', '').trim());
    const capturaDatos = {
      habilitada: document.getElementById('capturaHabilitada').checked,
      mensaje: document.getElementById('mensajeCaptura').value.trim()
    };
    const handoff = {
      confirmado: document.getElementById('handoffConfirmado').checked,
      mensaje: document.getElementById('mensajeHandoff').value.trim(),
      etiqueta: document.getElementById('etiquetaHandoff').value.trim(),
      equipoDestino: document.getElementById('equipoDestino').value,
      actualizarBaserow: document.getElementById('actualizarBaserow').checked
    };
    const automatizacion = { triggers, capturaDatos, handoff };
    // Sección 6
    const excepciones = {
      noEntiendo: {
        habilitado: document.getElementById('noEntiendoHabilitado').checked,
        intentos: parseInt(document.getElementById('noEntiendoIntentos').value, 10) || 2
      },
      palabraEscape: {
        habilitado: document.getElementById('escapeHabilitado').checked,
        palabras: document.getElementById('palabrasEscape').value.split(',').map(s => s.trim()).filter(Boolean)
      },
      tiemposEspera: {
        habilitado: document.getElementById('recordatorioHabilitado').checked,
        horas: parseInt(document.getElementById('horasRecordatorio').value, 10) || 24,
        mensaje: document.getElementById('mensajeRecordatorio').value.trim()
      }
    };

    return { vision, crm, chatwoot, embudo, automatizacion, excepciones, timestamp: new Date().toISOString() };
  }

  // Envío
  document.getElementById('btnEnviar').addEventListener('click', async () => {
    // Validar todos los pasos antes de enviar
    for (let i = 0; i < sections.length - 1; i++) {
      if (!validateStep(i)) { setStep(i); return; }
    }
    const payload = collectData();
    // Añadir token del brief si existe
    try { payload.briefToken = window.BRIEF_TOKEN || null; } catch (_) {}
    try {
      statusEnvio.textContent = 'Enviando…';
      const res = await sendWithFallback(WEBHOOK_URLS, payload);
      statusEnvio.textContent = 'Enviado';
      // Marcar el token como usado en este navegador
      try { if (payload.briefToken) { localStorage.setItem('briefUsed:' + payload.briefToken, '1'); } } catch (_) {}
      openGracias();
    } catch (err) {
      statusEnvio.textContent = 'Ocurrió un error al enviar. Intenta nuevamente.';
      console.error(err);
    }
  });

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

  async function getToFirstAvailable(urls, payload) {
    let lastError;
    const query = '?payload=' + encodeURIComponent(JSON.stringify(payload));
    for (const baseUrl of urls) {
      const url = baseUrl + query;
      try {
        const response = await fetch(url, { method: 'GET' });
        if (response.ok) return response;
        lastError = new Error('Solicitud no OK: ' + response.status);
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError || new Error('No se pudo enviar a ningún endpoint (GET)');
  }

  async function sendWithFallback(urls, payload) {
    try {
      return await postToFirstAvailable(urls, payload);
    } catch (e) {
      // Intentar GET si POST falla (nodo configurado como GET)
      return await getToFirstAvailable(urls, payload);
    }
  }

  function openGracias() { modalGracias.classList.add('active'); }

  // Accesibilidad: cerrar modal al fondo
  modalGracias.addEventListener('click', (e) => {
    if (e.target === modalGracias) modalGracias.classList.remove('active');
  });

  // Inicializar
  setStep(0);
})();


