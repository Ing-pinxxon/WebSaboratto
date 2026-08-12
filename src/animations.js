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
    if (!document.querySelector('.hero')) return;

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

/**
 * Entrada del sello de autoría del pie de página.
 *
 * No usa GSAP a propósito: en la home initAnimations() no corre hasta que termina
 * el preloader (~3s), y con un IntersectionObserver las seis páginas se comportan
 * igual. La animación en sí vive en CSS (.sello-bird / @keyframes selloBirdIn).
 *
 * El estado oculto lo aplica .is-armed desde aquí, nunca desde el CSS base: si este
 * módulo no llega a ejecutarse, el sello se ve como siempre.
 */
export function initSelloPinzon() {
    const sello = document.querySelector('.sello-pinzon');
    if (!sello) return;

    // Sin movimiento: no se arma, así que el sello queda visible al instante.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    sello.classList.add('is-armed');

    const ESPERA_QUIETO = 140;   // ms sin scroll para dar por detenido al usuario
    const TOPE_VISIBLE = 1200;   // ms visible sin aquietarse tras los que se vuela igual
    const RED_SEGURIDAD = 3500;  // ms para rescatar un observer que no reaccionó

    let debounce;      // espera a que pare el scroll
    let tope;          // tope por si el scroll nunca para
    let redSeguridad;
    let io;
    let hecho = false;

    const visible = () => {
        const r = sello.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
    };

    const reveal = () => {
        if (hecho) return;
        hecho = true;
        clearTimeout(debounce);
        clearTimeout(tope);
        clearTimeout(redSeguridad);
        window.removeEventListener('scroll', alDetectar);
        if (io) io.disconnect();
        sello.classList.add('is-in');
    };

    // No se vuela en cuanto el sello asoma: eso pasa con el pájaro pegado al borde
    // inferior y el usuario todavía deslizando con inercia, así que la animación se
    // consume antes de que el ojo llegue al pie. Se espera a que el scroll se
    // detenga y recién ahí despega, con el footer quieto delante.
    function alDetectar() {
        if (hecho || !visible()) return;
        clearTimeout(debounce);
        debounce = setTimeout(reveal, ESPERA_QUIETO);
        // Si el usuario nunca deja de scrollear, no lo dejamos colgado para siempre.
        if (!tope) tope = setTimeout(reveal, TOPE_VISIBLE);
    }

    // El listener de scroll no es redundante con el observer: en Safari iOS el IO
    // entrega los callbacks de forma irregular durante el scroll con inercia, y
    // este recálculo directo del rect cubre ese hueco.
    window.addEventListener('scroll', alDetectar, { passive: true });

    // Umbral bajo: aquí solo interesa DETECTAR que el sello llegó a pantalla; el
    // encuadre lo resuelve la espera a que el scroll pare, no el umbral. Sin
    // rootMargin negativo: con el scroll al fondo el sello queda a unos 44px del
    // borde, así que cualquier banda excluida mayor lo dejaría fuera de alcance
    // permanentemente y el observer no dispararía nunca.
    io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) alDetectar();
    }, { threshold: 0.3 });

    // Red de seguridad, pero NUNCA a ciegas: si disparara sola, el pájaro volaría
    // con el pie fuera de pantalla (nadie baja hasta el footer en 3.5s) y el
    // usuario llegaría con la animación ya hecha. Solo rescata el caso que importa:
    // el sello está a la vista y nada lo reveló.
    redSeguridad = setTimeout(() => {
        if (visible()) reveal();
    }, RED_SEGURIDAD);

    io.observe(sello);
}

export function initParallax() {
    gsap.utils.toArray('.feature-icon-wrap').forEach(icon => {
        gsap.to(icon, {
            y: -10,
            duration: 2.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });

    if (!document.querySelector('.hero')) return;

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
}

export function initAutoScroll() {
    const configs = [
        { id: 'testimonials-container', step: 0.8 },
        { id: 'gallery-container', step: 1 }
    ];

    configs.forEach(config => {
        const el = document.getElementById(config.id);
        if (!el) return;

        // Clonar elementos para loop infinito real
        const items = Array.from(el.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            el.appendChild(clone);
        });

        let isPaused = false;
        let resumeTimeout = null;

        const pause = (duration = 5000) => {
            isPaused = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isPaused = false;
                resumeTimeout = null;
            }, duration);
        };

        // Eventos de pausa
        el.addEventListener('mouseenter', () => isPaused = true);
        el.addEventListener('mouseleave', () => {
            if (!resumeTimeout) isPaused = false;
        });
        el.addEventListener('touchstart', () => pause(8000), { passive: true });
        
        // Escuchar evento personalizado de las flechas
        el.addEventListener('pause-autoscroll', () => pause(6000));

        // Animación de scroll
        const scroll = () => {
            if (!isPaused) {
                el.scrollLeft += config.step;
                
                // Si llegamos a la mitad (donde empiezan los clones), saltamos al inicio instantáneamente
                if (el.scrollLeft >= el.scrollWidth / 2) {
                    el.scrollLeft = 0;
                }
            }
            requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);
    });
}
