/**
 * Advanced Animations System
 * Sistema unificado para todas las animaciones avanzadas
 */
class AdvancedAnimations {
    constructor() {
        this.initialized = false;
        this.animations = [];
        this.observers = [];
        this.rafCallbacks = new Set();
        this.rafId = null;
        this.trustBadges = null;
        this.morphingShapes = [];
    }

    init() {
        if (this.initialized) return;

        // Sistema de animaciones avanzadas inicializado sin console.log
        
        this.initScrollProgress();
        this.initHeroStats();
        this.initMorphingBackground();
        this.initParallax();
        this.initTextReveals();
        this.initTrustIndicators();
        
        this.initialized = true;
    }

    // ... existing code ...
} 