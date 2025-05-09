document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            header.classList.toggle('nav-open'); 
        });

        navLinks.querySelectorAll('a:not(.btn-consulta)').forEach(link => {
            // Solo cerrar si es un link de navegación normal, no el botón de Cal.com
            if (!link.closest('.btn-container')) { 
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('nav-open')) {
                        navLinks.classList.remove('nav-open');
                        header.classList.remove('nav-open');
                    }
                });
            }
        });
        
        // También cerrar si se hace clic en el botón de Cal.com dentro del menú móvil
        const mobileCtaButton = navLinks.querySelector('.nav-cta-mobile .btn-consulta');
        if (mobileCtaButton) {
            mobileCtaButton.addEventListener('click', () => {
                 if (navLinks.classList.contains('nav-open')) {
                    // Esperar un poco para que Cal.com se inicie antes de cerrar el menú
                    setTimeout(() => {
                        navLinks.classList.remove('nav-open');
                        header.classList.remove('nav-open');
                    }, 100); 
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
            }
        });
    }, {
        threshold: 0.1 
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Active Nav Link Highlighting on Scroll
    const sections = document.querySelectorAll('main section[id]');
    const navAnchors = document.querySelectorAll('header nav ul li a:not(.btn-consulta)'); // Excluir el botón
    const pageHeader = document.querySelector('header'); // Necesitamos el header para el offset

    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = pageHeader ? pageHeader.offsetHeight : 0; // Obtener altura del header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - headerHeight - sectionHeight / 3)) { 
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    });

});