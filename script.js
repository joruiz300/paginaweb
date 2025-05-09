document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    // const mainNav = document.querySelector('.main-nav'); // No se usa directamente para el toggle
    const navLinksContainer = document.querySelector('.main-nav .nav-links'); // El ul que se mostrará/ocultará
    const pageHeader = document.querySelector('header');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinksContainer.classList.toggle('nav-open');
            // pageHeader.classList.toggle('nav-open'); // Podría usarse para estilizar el header cuando el nav está abierto
        });

        // Cerrar menú si se hace clic en un link de navegación (no en un botón Cal.com)
        navLinksContainer.querySelectorAll('a').forEach(link => {
            // Solo cerrar si es un link de sección y no el botón Cal.com del dropdown
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#') && !link.classList.contains('cal-popup-trigger')) { 
                link.addEventListener('click', () => {
                    if (navLinksContainer.classList.contains('nav-open')) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navLinksContainer.classList.remove('nav-open');
                        // pageHeader.classList.remove('nav-open');
                    }
                });
            }
        });
        
        // Cerrar menú si se hace clic en el botón Cal.com DENTRO del menú desplegable
        const mobileDropdownCtaButton = navLinksContainer.querySelector('.nav-cta-mobile-dropdown .cal-popup-trigger');
        if (mobileDropdownCtaButton) {
            mobileDropdownCtaButton.addEventListener('click', (event) => {
                if (navLinksContainer.classList.contains('nav-open')) {
                    setTimeout(() => { 
                        navToggle.setAttribute('aria-expanded', 'false');
                        navLinksContainer.classList.remove('nav-open');
                        // pageHeader.classList.remove('nav-open');
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

    // Scroll Animations for general elements and SVG decorators
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Opcional: Des-observar después de animar
            }
            // else { // Opcional: para que la animación se repita al scrollear hacia arriba
            //     entry.target.classList.remove('is-visible');
            // }
        });
    }, {
        threshold: 0.1 // Trigger cuando 10% del elemento es visible (0.05 para SVG decorators si quieres que aparezcan antes)
    });
    animatedElements.forEach(el => observer.observe(el));


    // Active Nav Link Highlighting on Scroll
    const sections = document.querySelectorAll('main section[id]');
    // Seleccionar solo los 'a' que son links de navegación, no los botones Cal.com
    const navAnchors = document.querySelectorAll('.main-nav .nav-links li a:not(.cal-popup-trigger)'); 

    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = pageHeader ? pageHeader.offsetHeight : 0; // Obtener altura del header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Ajustar el offset para que el link se active un poco antes de que la sección llegue al tope
            if (pageYOffset >= (sectionTop - headerHeight - sectionHeight / 3)) { 
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            // Asegurarse que el 'a' tiene un href antes de intentar acceder a substring
            if (a.getAttribute('href') && a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    });

    // No se necesita JavaScript adicional para el pop-up de Cal.com,
    // ya que se maneja mediante los atributos data-cal-* y el script de Cal.com.
    // Quitar href="#" de los <a> que activan Cal.com es la mejor manera de evitar saltos.
    // Si por alguna razón tuvieras href="#" y quisieras prevenir el salto vía JS:
    /*
    document.querySelectorAll('a.cal-popup-trigger').forEach(trigger => {
        if (trigger.getAttribute('href') === '#') {
            trigger.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
    });
    */

});
