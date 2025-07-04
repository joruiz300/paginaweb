// FLUJO CALOR - JavaScript Optimizado
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuración inicial
    const CONFIG = {
        webhookURL: 'https://n8n.mathai.agency/webhook/leadmagnet1',
        contentPageURL: '/flujo-calor-contenido.html',
        analytics: {
            trackingID: 'G-LWV7YB90M5',
            events: {
                PAGE_VIEW: 'flujo_calor_page_view',
                FORM_START: 'flujo_calor_form_start',
                FORM_SUBMIT: 'flujo_calor_form_submit',
                FORM_SUCCESS: 'flujo_calor_form_success',
                FORM_ERROR: 'flujo_calor_form_error',
                ETAPA_HOVER: 'flujo_calor_etapa_hover',
                ENTREGABLE_HOVER: 'flujo_calor_entregable_hover',
                TIMER_VIEW: 'flujo_calor_timer_view',
                FLUJO_VISUAL_VIEW: 'flujo_calor_visual_view'
            }
        }
    };

    // Initialize Analytics
    function trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'flujo_calor',
                ...parameters
            });
        }
        // Debug logging removed for production
    }

    // Elementos del DOM
    const form = document.getElementById('flujoCalorForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('btnAcceso');
    const btnContent = submitBtn.querySelector('.btn-content');
    const btnLoadingState = submitBtn.querySelector('.btn-loading-state');

    // Variables de estado
    let formStarted = false;
    let startTime = Date.now();

    // ====== FUNCIONALIDADES DE ANIMACIÓN ÚNICAS ======

    // Animación inicial de aparición de elementos
    function initializeAnimations() {
        // Timer badge animation
        const timerBadge = document.querySelector('.timer-badge');
        if (timerBadge) {
            timerBadge.style.opacity = '0';
            timerBadge.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                timerBadge.style.transition = 'all 0.8s ease-out';
                timerBadge.style.opacity = '1';
                timerBadge.style.transform = 'translateY(0)';
                trackEvent(CONFIG.analytics.events.TIMER_VIEW);
            }, 500);
        }

        // Título FLUJO CALOR con efecto typewriter
        const titleCalor = document.querySelector('.title-calor');
        if (titleCalor) {
            const originalText = titleCalor.textContent;
            titleCalor.textContent = '';
            titleCalor.style.borderRight = '3px solid #FF4500';
            
            let i = 0;
            const typewriterInterval = setInterval(() => {
                titleCalor.textContent += originalText.charAt(i);
                i++;
                
                if (i >= originalText.length) {
                    clearInterval(typewriterInterval);
                    setTimeout(() => {
                        titleCalor.style.borderRight = 'none';
                    }, 1000);
                }
            }, 150);
        }

        // Visualización del flujo con delay
        setTimeout(() => {
            const flujoVisual = document.querySelector('.flujo-visual');
            if (flujoVisual) {
                flujoVisual.style.opacity = '0';
                flujoVisual.style.transform = 'translateY(30px)';
                flujoVisual.style.transition = 'all 1s ease-out';
                
                setTimeout(() => {
                    flujoVisual.style.opacity = '1';
                    flujoVisual.style.transform = 'translateY(0)';
                    trackEvent(CONFIG.analytics.events.FLUJO_VISUAL_VIEW);
                }, 100);
            }
        }, 1500);

        // Etapas con animación escalonada
        const etapas = document.querySelectorAll('.etapa');
        etapas.forEach((etapa, index) => {
            etapa.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // ====== INTERACCIONES ESPECIALES ======

    // Hover effects para etapas
    function initializeEtapaInteractions() {
        const etapas = document.querySelectorAll('.etapa');
        
        etapas.forEach((etapa, index) => {
            etapa.addEventListener('mouseenter', () => {
                trackEvent(CONFIG.analytics.events.ETAPA_HOVER, {
                    etapa_number: index + 1,
                    etapa_name: etapa.querySelector('h3').textContent
                });
                
                // Efecto glow para la etapa activa
                etapa.style.boxShadow = '0 15px 40px rgba(255, 69, 0, 0.3)';
                
                // Animación del número
                const numero = etapa.querySelector('.etapa-numero');
                if (numero) {
                    numero.style.transform = 'translateX(-50%) scale(1.2)';
                    numero.style.transition = 'transform 0.3s ease';
                }
            });
            
            etapa.addEventListener('mouseleave', () => {
                etapa.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                
                const numero = etapa.querySelector('.etapa-numero');
                if (numero) {
                    numero.style.transform = 'translateX(-50%) scale(1)';
                }
            });
        });
    }

    // Hover effects para entregables
    function initializeEntregableInteractions() {
        const entregables = document.querySelectorAll('.entregable');
        
        entregables.forEach((entregable, index) => {
            entregable.addEventListener('mouseenter', () => {
                trackEvent(CONFIG.analytics.events.ENTREGABLE_HOVER, {
                    entregable_index: index,
                    entregable_name: entregable.querySelector('h4').textContent
                });
                
                // Efecto shimmer
                const shimmer = document.createElement('div');
                shimmer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 69, 0, 0.1), transparent);
                    transition: left 0.6s ease;
                    pointer-events: none;
                `;
                
                entregable.style.position = 'relative';
                entregable.style.overflow = 'hidden';
                entregable.appendChild(shimmer);
                
                setTimeout(() => {
                    shimmer.style.left = '100%';
                }, 50);
                
                setTimeout(() => {
                    entregable.removeChild(shimmer);
                }, 700);
            });
        });
    }

    // ====== FORMULARIO AVANZADO CON VALIDACIÓN PROFESIONAL ======

    function initializeFormInteractions() {
        // Form start tracking
        [nombreInput, emailInput].forEach(input => {
            input.addEventListener('focus', () => {
                if (!formStarted) {
                    formStarted = true;
                    trackEvent(CONFIG.analytics.events.FORM_START, {
                        time_to_form: Date.now() - startTime
                    });
                }
            });
        });

        // Configurar atributos para validación avanzada
        nombreInput.required = true;
        nombreInput.dataset.label = 'Tu nombre';
        nombreInput.dataset.validateName = 'true';
        nombreInput.minLength = 2;
        nombreInput.maxLength = 50;
        
        emailInput.required = true;
        emailInput.type = 'email';
        emailInput.dataset.label = 'Tu email';

        // Inicializar validador profesional
        const formValidator = new FormValidator(form, {
            realTimeValidation: true,
            showProgressBar: true,
            antiSpam: true,
            customMessages: {
                'nombre_required': 'Por favor ingresa tu nombre',
                'nombre_minLength': 'Tu nombre debe tener al menos 2 caracteres',
                'email_required': 'Por favor ingresa tu email',
                'email_email': 'Por favor ingresa un email válido'
            },
            onSubmit: (formData) => {
                // Override del submit normal para usar nuestra lógica existente
                handleFormSubmit(new Event('submit'));
            },
            onValidationChange: (fieldConfig, formState) => {
                // Track validación en tiempo real
                trackEvent('flujo_calor_validation_change', {
                    field_name: fieldConfig.element.name,
                    is_valid: fieldConfig.isValid,
                    form_completion: Math.round((Object.values(formState.fields).filter(f => f.isValid).length / Object.keys(formState.fields).length) * 100)
                });
            }
        });

        // Mantener validación visual legacy para compatibilidad
        function validateInput(input, validationFn, errorMsg) {
            const container = input.closest('.input-flujo');
            const underline = container.querySelector('.input-underline');
            
            function showError() {
                container.style.animation = 'shake 0.5s ease-in-out';
                underline.style.background = '#ff4757';
                input.style.borderBottomColor = '#ff4757';
                
                setTimeout(() => {
                    container.style.animation = '';
                }, 500);
            }
            
            function showSuccess() {
                underline.style.background = 'var(--flujo-gradient)';
                input.style.borderBottomColor = 'var(--flujo-primary)';
            }
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') return;
                
                if (validationFn(input.value)) {
                    showSuccess();
                } else {
                    showError();
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value.trim() !== '' && validationFn(input.value)) {
                    showSuccess();
                }
            });
        }

        // Validaciones específicas (legacy support)
        validateInput(nombreInput, (value) => value.trim().length >= 2, 'Nombre muy corto');
        validateInput(emailInput, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Email inválido');

        // Efecto de breathing en el formulario
        const formularioContainer = document.querySelector('.formulario-acceso');
        if (formularioContainer) {
            let breatheInterval = setInterval(() => {
                formularioContainer.style.transform = 'scale(1.005)';
                setTimeout(() => {
                    formularioContainer.style.transform = 'scale(1)';
                }, 1000);
            }, 4000);
            
            // Parar breathing cuando el usuario interactúa
            form.addEventListener('focus', () => {
                clearInterval(breatheInterval);
                formularioContainer.style.transform = 'scale(1)';
            }, true);
        }
    }

    // ====== SUBMIT Y REDIRECCIÓN ======

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        
        // Rate limiting básico
        if (!checkRateLimit()) {
            showFormError('Por favor espera un momento antes de enviar el formulario nuevamente');
            return;
        }

        // Validación final mejorada
        if (!nombre || nombre.trim().length < 2) {
            showFormError('Por favor ingresa tu nombre completo (mínimo 2 caracteres)');
            nombreInput.focus();
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormError('Por favor ingresa un email válido');
            emailInput.focus();
            return;
        }

        // Validación adicional anti-spam
        if (!passesAdvancedAntiSpam(nombre, email)) {
            showFormError('Por favor completa el formulario correctamente');
            return;
        }
        
        // Mostrar loading state
        showLoadingState();
        
        try {
            // Enviar datos al webhook
            const webhookData = {
                nombre: nombre,
                email: email,
                source: 'flujo_calor_lead_magnet',
                timestamp: new Date().toISOString(),
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                time_on_page: Date.now() - startTime,
                form_interactions: formStarted
            };
            
            trackEvent(CONFIG.analytics.events.FORM_SUBMIT, {
                nombre_length: nombre.length,
                email_domain: email.split('@')[1],
                time_to_submit: Date.now() - startTime
            });
            
            const response = await fetch(CONFIG.webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookData)
            });
            
            if (response.ok) {
                // Éxito: Guardar datos en localStorage y redirigir
                localStorage.setItem('flujoCalorUser', JSON.stringify({
                    nombre: nombre,
                    email: email,
                    accessTime: Date.now()
                }));
                
                trackEvent(CONFIG.analytics.events.FORM_SUCCESS, {
                    conversion_time: Date.now() - startTime
                });
                
                // Animación de éxito antes de redirigir
                showSuccessAnimation(() => {
                    window.location.href = CONFIG.contentPageURL;
                });
                
            } else {
                throw new Error('Error en el webhook');
            }
            
        } catch (error) {
            // Error logged for analytics tracking only
            
            trackEvent(CONFIG.analytics.events.FORM_ERROR, {
                error_message: error.message,
                time_to_error: Date.now() - startTime
            });
            
            // En caso de error del webhook, aún redirigir (lead magnet debe funcionar)
            localStorage.setItem('flujoCalorUser', JSON.stringify({
                nombre: nombre,
                email: email,
                accessTime: Date.now(),
                webhookError: true
            }));
            
            showSuccessAnimation(() => {
                window.location.href = CONFIG.contentPageURL;
            });
        }
    }

    function showLoadingState() {
        submitBtn.disabled = true;
        btnContent.style.display = 'none';
        btnLoadingState.style.display = 'flex';
        submitBtn.style.cursor = 'not-allowed';
    }

    function showFormError(message) {
        // Reset loading state
        submitBtn.disabled = false;
        btnContent.style.display = 'flex';
        btnLoadingState.style.display = 'none';
        submitBtn.style.cursor = 'pointer';
        
        // Shake animation
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
        
        // Mostrar mensaje temporalmente
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: #ff4757;
            color: white;
            padding: 0.75rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            font-size: 0.9rem;
            animation: fadeInOut 3s ease;
        `;
        errorDiv.textContent = message;
        
        form.appendChild(errorDiv);
        
        setTimeout(() => {
            form.removeChild(errorDiv);
        }, 3000);
    }

    function showSuccessAnimation(callback) {
        // Transformar botón en estado de éxito
        submitBtn.style.background = 'var(--flujo-success)';
        btnContent.innerHTML = '<span>🎉</span><span>¡Acceso Activado!</span><span>→</span>';
        btnContent.style.display = 'flex';
        btnLoadingState.style.display = 'none';
        
        // Partículas de éxito
        createSuccessParticles();
        
        // Efecto de zoom out del formulario
        const formularioAcceso = document.querySelector('.formulario-acceso');
        formularioAcceso.style.transform = 'scale(1.05)';
        formularioAcceso.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            formularioAcceso.style.transform = 'scale(1)';
        }, 200);
        
        // Callback después de la animación
        setTimeout(callback, 1500);
    }

    function createSuccessParticles() {
        const container = document.querySelector('.formulario-acceso');
        const colors = ['#FF4500', '#FF6B35', '#F7931E'];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rect = container.getBoundingClientRect();
            particle.style.left = rect.width / 2 + 'px';
            particle.style.top = rect.height / 2 + 'px';
            
            container.appendChild(particle);
            
            // Animación de explosión
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = rect.width / 2;
            let y = rect.height / 2;
            let opacity = 1;
            
            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02;
                opacity -= 0.02;
                
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    container.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    // ====== ANTI-SPAM Y RATE LIMITING ======

    function checkRateLimit() {
        const lastSubmission = localStorage.getItem('flujoCalorLastSubmission');
        const now = Date.now();
        
        if (lastSubmission) {
            const timeDiff = now - parseInt(lastSubmission);
            const minInterval = 30000; // 30 segundos mínimo entre envíos
            
            if (timeDiff < minInterval) {
                return false;
            }
        }
        
        localStorage.setItem('flujoCalorLastSubmission', now.toString());
        return true;
    }

    function passesAdvancedAntiSpam(nombre, email) {
        // Verificar patrones sospechosos
        const suspiciousPatterns = [
            /test/i,
            /admin/i,
            /sample/i,
            /example/i,
            /^a+$/i,
            /^(.)\1{4,}$/i // Caracteres repetidos
        ];
        
        // Verificar nombre
        if (suspiciousPatterns.some(pattern => pattern.test(nombre))) {
            return false;
        }
        
        // Verificar dominios sospechosos
        const suspiciousDomains = [
            'mailinator.com',
            '10minutemail.com',
            'guerrillamail.com',
            'temp-mail.org',
            'throwaway.email'
        ];
        
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (suspiciousDomains.includes(emailDomain)) {
            return false;
        }
        
        // Verificar tiempo de completado (debe ser realista)
        const completionTime = Date.now() - startTime;
        if (completionTime < 5000) { // Menos de 5 segundos es sospechoso
            return false;
        }
        
        return true;
    }

    // ====== TRACKING CALENDLY ======

    function initCalendarTracking() {
        document.querySelectorAll('.cal-popup-trigger').forEach(function(button) {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                trackEvent('flujo_calor_calendar_click', {
                    button_text: buttonText,
                    page_section: 'lead_capture_page_cta',
                    time_on_page: Date.now() - startTime
                });
            });
        });
    }

    // ====== INICIALIZACIÓN ======

    function initialize() {
        // System initialized for production
        
        // Tracking inicial
        trackEvent(CONFIG.analytics.events.PAGE_VIEW, {
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`
        });
        
        // Inicializar todas las funcionalidades
        initializeAnimations();
        initializeEtapaInteractions();
        initializeEntregableInteractions();
        initializeFormInteractions();
        
        // Event listeners
        form.addEventListener('submit', handleFormSubmit);
        
        // Tracking para botones de Calendly
        initCalendarTracking();
        
        // CSS Animations keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateY(10px); }
                10%, 90% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        // System ready for production
    }

    // ====== SCROLL ANALYTICS ======

    let scrollTracked = false;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > 50 && !scrollTracked) {
            scrollTracked = true;
            trackEvent('flujo_calor_scroll_50', {
                scroll_depth: Math.round(scrollPercent)
            });
        }
    });

    // ====== PAGE VISIBILITY ======

    let visibilityStartTime = Date.now();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const timeOnPage = Date.now() - visibilityStartTime;
            trackEvent('flujo_calor_page_leave', {
                time_on_page: timeOnPage,
                form_started: formStarted
            });
        } else {
            visibilityStartTime = Date.now();
        }
    });

    // Inicializar cuando el DOM esté listo
    initialize();
});
