document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav'); // Cambiado para seleccionar el contenedor de los links
    const navLinksContainer = document.querySelector('.nav-links'); // El ul que se mostrará/ocultará
    const pageHeader = document.querySelector('header');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinksContainer.classList.toggle('nav-open');
            pageHeader.classList.toggle('nav-open'); // Para el icono hamburguesa si es necesario
        });

        // Cerrar menú si se hace clic en un link de navegación (no en un botón Cal.com)
        navLinksContainer.querySelectorAll('a').forEach(link => {
            if (!link.classList.contains('cal-popup-trigger')) { // No cerrar si es un botón Cal
                link.addEventListener('click', () => {
                    if (navLinksContainer.classList.contains('nav-open')) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navLinksContainer.classList.remove('nav-open');
                        pageHeader.classList.remove('nav-open');
                    }
                });
            }
        });
        
        // Cerrar menú si se hace clic en el botón Cal.com DENTRO del menú desplegable
        const mobileDropdownCtaButton = navLinksContainer.querySelector('.nav-cta-mobile-dropdown .cal-popup-trigger');
        if (mobileDropdownCtaButton) {
            mobileDropdownCtaButton.addEventListener('click', (event) => {
                // Cal.com se encarga de abrir el popup. Aquí solo cerramos el menú.
                if (navLinksContainer.classList.contains('nav-open')) {
                    setTimeout(() => { // Pequeño delay para asegurar que Cal.com procese el click
                        navToggle.setAttribute('aria-expanded', 'false');
                        navLinksContainer.classList.remove('nav-open');
                        pageHeader.classList.remove('nav-open');
                    }, 50); 
                }
            });
        }
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionButton && answer) {
            questionButton.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                // Opcional: cerrar otros items
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item && otherItem.classList.contains('open')) {
                //         otherItem.classList.remove('open');
                //         otherItem.querySelector('.faq-answer').style.maxHeight = null;
                //     }
                // });
                item.classList.toggle('open');
                if (item.classList.contains('open')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = null;
                }
            });
        }
    });

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Opcional: Des-observar después de animar
            }
        });
    }, {
        threshold: 0.1 
    });
    animatedElements.forEach(el => observer.observe(el));

    // Active Nav Link Highlighting on Scroll
    const sections = document.querySelectorAll('main section[id]');
    // Seleccionar solo los 'a' que son links de navegación, no los botones Cal.com
    const navAnchors = document.querySelectorAll('.main-nav .nav-links li a:not(.cal-popup-trigger)'); 

    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = pageHeader ? pageHeader.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - headerHeight - sectionHeight / 3)) { 
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') && a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    });

    // Evitar salto de página para todos los triggers de Cal.com
    // Cal.com debería manejar esto, pero es una buena práctica si se usa <a> sin href
    // document.querySelectorAll('.cal-popup-trigger').forEach(trigger => {
    //     trigger.addEventListener('click', function(event) {
    //         // No es necesario event.preventDefault() si Cal.com lo maneja correctamente
    //         // y si el elemento <a> no tiene un atributo href="#" o href=""
    //         // Si tiene href="#", el preventDefault es útil.
    //         // Como hemos quitado href, Cal.com debería ser suficiente.
    //     });
    // });

});
