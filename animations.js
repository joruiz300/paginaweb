// ==============================================
// SISTEMA DE ANIMACIONES PROFESIONAL - MATH AI
// React Spring + Intersection Observer
// ==============================================

import { useSpring, useTrail, useTransition, animated, config } from '@react-spring/web';
import { useState, useEffect, useRef } from 'react';

// ========================================
// 1. HOOK PERSONALIZADO - INTERSECTION OBSERVER
// ========================================
export const useInView = (options = {}) => {
    const [inView, setInView] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    // Una vez visible, no necesitamos seguir observando
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
                ...options
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return [ref, inView];
};

// ========================================
// 2. FADE IN ELEGANTE CON STAGGER
// ========================================
export const FadeInStagger = ({ children, delay = 0 }) => {
    const [ref, inView] = useInView();
    
    const springs = useSpring({
        from: { 
            opacity: 0, 
            transform: 'translateY(30px) scale(0.95)',
            filter: 'blur(4px)'
        },
        to: inView ? {
            opacity: 1,
            transform: 'translateY(0px) scale(1)',
            filter: 'blur(0px)'
        } : {
            opacity: 0,
            transform: 'translateY(30px) scale(0.95)',
            filter: 'blur(4px)'
        },
        config: { 
            tension: 280, 
            friction: 60,
            mass: 1
        },
        delay: delay
    });

    return (
        <animated.div ref={ref} style={springs}>
            {children}
        </animated.div>
    );
};

// ========================================
// 3. TRAIL ANIMATION PARA TARJETAS
// ========================================
export const CardTrail = ({ children, inView }) => {
    const items = Array.isArray(children) ? children : [children];
    
    const trail = useTrail(items.length, {
        from: { 
            opacity: 0, 
            transform: 'translateY(40px) rotateX(15deg)',
            filter: 'blur(8px)'
        },
        to: inView ? {
            opacity: 1,
            transform: 'translateY(0px) rotateX(0deg)',
            filter: 'blur(0px)'
        } : {
            opacity: 0,
            transform: 'translateY(40px) rotateX(15deg)',
            filter: 'blur(8px)'
        },
        config: config.gentle,
        delay: inView ? 100 : 0
    });

    return trail.map((style, index) => (
        <animated.div key={index} style={style}>
            {items[index]}
        </animated.div>
    ));
};

// ========================================
// 4. PARALLAX SUTIL
// ========================================
export const ParallaxElement = ({ children, intensity = 0.3 }) => {
    const [scrollY, setScrollY] = useState(0);
    
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const springs = useSpring({
        transform: `translateY(${scrollY * intensity}px)`,
        config: config.slow
    });

    return (
        <animated.div style={springs}>
            {children}
        </animated.div>
    );
};

// ========================================
// 5. HOVER MICRO-INTERACCIONES
// ========================================
export const InteractiveElement = ({ children, scale = 1.05, rotation = 2 }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const springs = useSpring({
        transform: isHovered ? 
            `scale(${scale}) rotate(${rotation}deg)` : 
            'scale(1) rotate(0deg)',
        boxShadow: isHovered ?
            '0 20px 40px rgba(255, 107, 0, 0.3)' :
            '0 5px 15px rgba(0, 0, 0, 0.1)',
        config: config.wobbly
    });

    return (
        <animated.div
            style={springs}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </animated.div>
    );
};

// ========================================
// 6. CONTADOR ANIMADO PARA ROI
// ========================================
export const CountingNumber = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
    const [ref, inView] = useInView();
    
    const { number } = useSpring({
        from: { number: 0 },
        to: { number: inView ? end : 0 },
        config: { duration },
        delay: inView ? 200 : 0
    });

    return (
        <animated.span ref={ref}>
            {number.to(n => `${prefix}${Math.floor(n)}${suffix}`)}
        </animated.span>
    );
};

// ========================================
// 7. SMOOTH ACCORDION PARA FAQ
// ========================================
export const SmoothAccordion = ({ isOpen, children }) => {
    const contentRef = useRef();
    
    const springs = useSpring({
        height: isOpen ? contentRef.current?.scrollHeight || 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'rotateX(0deg)' : 'rotateX(-10deg)',
        config: config.gentle
    });

    const iconSpring = useSpring({
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        config: config.wobbly
    });

    return (
        <animated.div style={springs} className="overflow-hidden">
            <div ref={contentRef}>
                {children}
            </div>
        </animated.div>
    );
};

// ========================================
// 8. BACKGROUND PARTICLES (Minimalista)
// ========================================
export const FloatingParticles = ({ count = 6 }) => {
    const particles = Array.from({ length: count }, (_, i) => i);
    
    const trail = useTrail(particles.length, {
        from: { opacity: 0, transform: 'scale(0)' },
        to: { opacity: 0.1, transform: 'scale(1)' },
        config: config.molasses,
        delay: i => i * 200
    });

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {trail.map((style, index) => (
                <Particle key={index} style={style} index={index} />
            ))}
        </div>
    );
};

const Particle = ({ style, index }) => {
    const [position] = useState({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10
    });

    const floatingSpring = useSpring({
        from: { 
            transform: `translate(${position.x}vw, ${position.y}vh) scale(0.5)` 
        },
        to: async (next) => {
            while (true) {
                await next({ 
                    transform: `translate(${position.x + Math.sin(Date.now() * 0.001 + index) * 20}vw, ${position.y + Math.cos(Date.now() * 0.001 + index) * 15}vh) scale(1)` 
                });
                await next({ 
                    transform: `translate(${position.x - Math.sin(Date.now() * 0.001 + index) * 20}vw, ${position.y - Math.cos(Date.now() * 0.001 + index) * 15}vh) scale(0.8)` 
                });
            }
        },
        config: { duration: 4000 + index * 1000 },
        loop: true
    });

    return (
        <animated.div
            style={{
                ...style,
                ...floatingSpring,
                position: 'absolute',
                width: `${position.size}px`,
                height: `${position.size}px`,
                borderRadius: '50%',
                background: `linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(255, 107, 0, 0.05))`,
                border: '1px solid rgba(255, 107, 0, 0.1)',
                backdropFilter: 'blur(1px)'
            }}
        />
    );
};

// ========================================
// 9. TEXTO CON EFECTO TYPEWRITER
// ========================================
export const TypewriterText = ({ text, speed = 50 }) => {
    const [ref, inView] = useInView();
    const [displayText, setDisplayText] = useState('');
    
    useEffect(() => {
        if (!inView) return;
        
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [inView, text, speed]);

    return (
        <span ref={ref}>
            {displayText}
            <animated.span style={{
                opacity: useSpring({
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                    config: { duration: 500 },
                    loop: { reverse: true }
                }).opacity
            }}>|</animated.span>
        </span>
    );
};

// ========================================
// 10. EXPORTACIONES
// ========================================
export { animated, config };