import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(initNavbar, initParallax) {
    initCursor();
    initMagneticButtons();
    initHeroAnimations();
    initScrollAnimations();
    initNavbar();
    initParallax();
}

function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring || window.innerWidth < 769) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1 });
    });

    gsap.ticker.add(() => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
    });

    const hoverTargets = document.querySelectorAll('button, a, .magnetic-btn, .product-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

function initMagneticButtons() {
    if (window.innerWidth < 769) return;
    const btns = document.querySelectorAll('.magnetic-btn');

    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    });
}

function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-content', { opacity: 1, duration: 0.01 })
        .to('.hero-word', {
            y: 0,
            skewX: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.12
        })
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to('.hero-visual', { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, '-=1')
        .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.3');

    gsap.to('.hero-img', {
        yPercent: 20,
        scale: 1.15,
        force3D: true,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            endTrigger: '.menu-section',
            end: 'top 80%',
            scrub: 0.5
        }
    });

    gsap.to('#hero-badge-1', {
        y: 120,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: '20% top',
            end: '60% top',
            scrub: 1
        }
    });

    gsap.to('#hero-badge-2', {
        y: -80,
        opacity: 0,
        rotation: 45,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: '15% top',
            end: '55% top',
            scrub: 1
        }
    });

    gsap.to('.hero-glow', {
        scale: 1.5,
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });

    gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 20,
        scrollTrigger: {
            trigger: '.hero',
            start: '10% top',
            end: '25% top',
            scrub: true
        }
    });
}

export function initScrollAnimations() {
    ScrollTrigger.refresh();

    gsap.utils.toArray('.section-header').forEach(header => {
        const tag = header.querySelector('.section-tag');
        const title = header.querySelector('.section-title');
        const line = header.querySelector('.section-line');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 90%',
                end: 'top 50%',
                toggleActions: 'play none none none'
            }
        });

        if (tag) tl.fromTo(tag, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });
        if (title) tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
        if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    });

    gsap.utils.toArray('.category-header').forEach(header => {
        gsap.fromTo(header, { opacity: 0, x: -50 }, {
            opacity: 1, x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 92%',
                toggleActions: 'play none none none'
            }
        });

        const line = header.querySelector('.category-line');
        if (line) {
            gsap.fromTo(line, { scaleX: 0 }, {
                scaleX: 1,
                transformOrigin: 'left center',
                duration: 0.8,
                delay: 0.3,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 92%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });

    gsap.utils.toArray('.product-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.product-card');
        gsap.fromTo(cards, { opacity: 0, y: 60, scale: 0.95 }, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 95%',
                toggleActions: 'play none none none'
            }
        });
    });

    gsap.utils.toArray('.feature-card').forEach((card) => {
        gsap.fromTo(card, { opacity: 0, y: 80 }, {
            opacity: 1, y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                toggleActions: 'play none none none'
            }
        });
    });

    gsap.fromTo('.gallery-item', { opacity: 0, x: 100 }, {
        opacity: 1, x: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    gsap.utils.toArray('.footer-block').forEach((block, i) => {
        gsap.fromTo(block, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 95%',
                toggleActions: 'play none none none'
            }
        });
    });

    setTimeout(() => {
        document.querySelectorAll('.product-card, .feature-card, .footer-block, .category-header, .section-header, .gallery-item').forEach(el => {
            if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
                gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.5 });
            }
        });
    }, 3000);
}

export function initParallax() {
    gsap.to('.hero-orb-1', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });

    gsap.to('.hero-orb-2', {
        y: -60,
        x: 40,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 3
        }
    });

    gsap.utils.toArray('.feature-icon-wrap').forEach(icon => {
        gsap.to(icon, {
            y: -10,
            duration: 2.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });
}

export function initAutoScroll() {
    const configs = [
        { id: 'testimonials-container', step: 1 },
        { id: 'gallery-container', step: 1 }
    ];

    configs.forEach(config => {
        const el = document.getElementById(config.id);
        if (!el) return;

        let isPaused = false;
        
        el.addEventListener('mouseenter', () => isPaused = true);
        el.addEventListener('mouseleave', () => isPaused = false);
        el.addEventListener('touchstart', () => isPaused = true);
        el.addEventListener('touchend', () => isPaused = false);

        setInterval(() => {
            if (isPaused) return;
            
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: config.step, behavior: 'auto' });
            }
        }, 30);
    });
}
