import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== LUCIDE ICONS =====
if (window.lucide) lucide.createIcons();

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    const logo = document.querySelector('.preloader-logo');
    const text = document.querySelector('.preloader-text');

    if (!preloader) return;

    // Animate logo
    gsap.to(logo, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
    gsap.to(text, { opacity: 1, duration: 0.5, delay: 0.3 });

    // Animate fill bar
    gsap.to(fill, {
        width: '100%',
        duration: 1.8,
        ease: 'power2.inOut',
        delay: 0.3,
        onComplete: () => {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    initAnimations();
                }
            });
        }
    });
}

// ===== CUSTOM CURSOR =====
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

    // Smooth ring follow
    gsap.ticker.add(() => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
    });

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('button, a, .magnetic-btn, .product-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// ===== MAGNETIC BUTTONS =====
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

// ===== MAIN ANIMATIONS =====
function initAnimations() {
    initCursor();
    initMagneticButtons();
    initHeroAnimations();
    initScrollAnimations();
    initNavbar();
    initParallax();
}

// ===== HERO ANIMATIONS =====
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero content fade in
    tl.to('.hero-content', { opacity: 1, duration: 0.01 })

        // Title words reveal (staggered from bottom)
        .to('.hero-word', {
            y: 0,
            skewX: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.12
        })

        // Description fade
        .to('.hero-desc', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.6')

        // Buttons
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.5')

        // Stats
        .to('.hero-stats', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.4')

        // Hero visual
        .to('.hero-visual', {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
        }, '-=1')

        // Scroll indicator
        .to('.scroll-indicator', {
            opacity: 1,
            duration: 0.6,
        }, '-=0.3');

    // Hero image sequence with GSAP ScrollTrigger
    // Efecto Parallax en el contenedor del video
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

    // Badges float away on scroll
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

    // Glow pulses larger on scroll
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

    // Scroll indicator fades out
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

// ===== SCROLL-TRIGGERED ANIMATIONS =====
function initScrollAnimations() {
    // Refrescar ScrollTrigger para que recalcule posiciones
    ScrollTrigger.refresh();

    // Section headers
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

    // Category headers
    gsap.utils.toArray('.category-header').forEach(header => {
        gsap.fromTo(header,
            { opacity: 0, x: -50 },
            {
                opacity: 1, x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 92%',
                    toggleActions: 'play none none none'
                }
            }
        );

        const line = header.querySelector('.category-line');
        if (line) {
            gsap.fromTo(line,
                { scaleX: 0 },
                {
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
                }
            );
        }
    });

    // Product cards — staggered reveal (más agresivo para que siempre se vean)
    gsap.utils.toArray('.product-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.product-card');
        gsap.fromTo(cards,
            { opacity: 0, y: 60, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 95%',  // Se activa mucho antes
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 80 },
            {
                opacity: 1, y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 92%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Gallery items
    gsap.fromTo('.gallery-item',
        { opacity: 0, x: 100 },
        {
            opacity: 1, x: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.gallery-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Footer blocks
    gsap.utils.toArray('.footer-block').forEach((block, i) => {
        gsap.fromTo(block,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: block,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // SAFETY NET: Si algo falla, aseguramos que todo sea visible después de 3s
    setTimeout(() => {
        document.querySelectorAll('.product-card, .feature-card, .footer-block, .category-header, .section-header, .gallery-item').forEach(el => {
            if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
                gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.5 });
            }
        });
    }, 3000);
}

// ===== NAVBAR =====
function initNavbar() {
    const nav = document.getElementById('navbar');

    ScrollTrigger.create({
        start: 'top -20',
        onUpdate: (self) => {
            if (self.direction === 1 && self.scroll() > 20) {
                nav.style.background = 'rgba(0, 0, 0, 0.92)';
                nav.style.boxShadow = '0 10px 40px rgba(0,0,0,0.4)';
            } else if (self.scroll() <= 20) {
                nav.style.background = 'rgba(0, 0, 0, 0.6)';
                nav.style.boxShadow = 'none';
            }
        }
    });
}

// ===== PARALLAX =====
function initParallax() {
    // Orbs parallax
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

    // Feature icons subtle float
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

// ===== SISTEMA DE PEDIDOS =====
let pedido = [];
const numeroSaboratto = '573222430079';

const INGREDIENTES_REMOVIBLES = {
    'Hamburguesa Tradicional': ['Queso', 'Cebolla Saboratto', 'Lechuga', 'Tomate', 'Papa ripio', 'Salsa de la casa'],
    'Hamburguesa Especial': ['Queso', 'Cebolla Saboratto', 'Lechuga', 'Tomate', 'Papa ripio', 'Salsa de la casa', 'Jamón ahumado', 'Tocineta', 'Huevo de codorniz'],
    'Hamburguesa Ranchera': ['Queso', 'Cebolla Saboratto', 'Lechuga', 'Tomate', 'Papa ripio', 'Salsa de la casa', 'Tocineta', 'Huevo de codorniz'],
    'Hamburguesa Con Todo': ['Queso', 'Cebolla Saboratto', 'Lechuga', 'Tomate', 'Papa ripio', 'Salsa de la casa', 'Jamón ahumado', 'Tocineta', 'Huevo de codorniz'],
    'Perro Caliente Tradicional': ['Queso doble crema', 'Cebolla Saboratto', 'Papa ripio', 'Salsa de la casa'],
    'Perro Caliente Especial': ['Queso doble crema', 'Cebolla Saboratto', 'Papa ripio', 'Salsa de la casa', 'Jamón ahumado', 'Tocineta', 'Huevo de codorniz'],
    'Perro Caliente Ranchero': ['Queso doble crema', 'Cebolla Saboratto', 'Papa ripio', 'Salsa de la casa', 'Tocineta'],
    'Salchipapa Tradicional': ['Queso', 'Huevo de codorniz', 'Salsa cheddar'],
    'Salchipapa Ranchera': ['Queso', 'Huevo de codorniz', 'Salsa cheddar', 'Tocineta'],
    'Salchipapa Doble': ['Queso', 'Huevo de codorniz', 'Salsa cheddar', 'Tocineta'],
    'Sándwich con carne de hamburguesa': ['Queso', 'Cebolla Saboratto', 'Lechuga', 'Tomate', 'Papa ripio', 'Salsa de la casa']
};

const EMOJIS_INGREDIENTES = {
    'Queso': '🧀',
    'Cebolla Saboratto': '🧅',
    'Lechuga': '🥬',
    'Tomate': '🍅',
    'Papa ripio': '🍟',
    'Salsa de la casa': '🥣',
    'Jamón ahumado': '🍖',
    'Tocineta': '🥓',
    'Huevo de codorniz': '🥚',
    'Queso doble crema': '🧀',
    'Salsa cheddar': '🧀'
};

window.agregarAlPedido = function (nombre, precio, btnEl) {
    if (INGREDIENTES_REMOVIBLES[nombre] && btnEl) {
        mostrarOpcionesInline(nombre, precio, btnEl);
    } else {
        procesarAgregarAlPedido(nombre, precio, []);
    }
};

window.mostrarOpcionesInline = function (nombre, precio, btnEl) {
    const cardInfo = btnEl.parentElement;

    // Si ya está abierto el panel allí, no hacer nada
    if (cardInfo.querySelector('.inline-customize')) return;

    // Ocultar botón "Agregar" original
    btnEl.style.display = 'none';

    // Crear el panel
    const panel = document.createElement('div');
    panel.className = 'inline-customize';
    panel.style.animation = 'fadeInUp 0.3s ease';

    let html = `<p class="inline-customize-title">¿Quitar algún ingrediente?</p><div class="inline-ingredients">`;

    INGREDIENTES_REMOVIBLES[nombre].forEach(ing => {
        const emoji = EMOJIS_INGREDIENTES[ing] || '🔸';
        html += `
            <div class="inline-ingredient-item" data-name="${ing}" onclick="toggleInlineIngredient(this)">
                <span class="inline-ingredient-name">${emoji} ${ing}</span>
                <input type="checkbox" class="ingredient-checkbox" checked onclick="event.stopPropagation(); toggleInlineIngredient(this.parentElement)">
            </div>
        `;
    });

    html += `</div>
        <div class="inline-customize-actions">
            <button onclick="cancelarInline(this)" class="btn-cancel-inline">Cancelar</button>
            <button onclick="confirmarInline(this, '${nombre}', ${precio})" class="btn-confirm-inline">Confirmar</button>
        </div>
    `;

    panel.innerHTML = html;
    cardInfo.appendChild(panel);
};

window.toggleInlineIngredient = function (element) {
    const isExcluded = element.classList.contains('excluded');
    const checkbox = element.querySelector('.ingredient-checkbox');

    if (isExcluded) {
        element.classList.remove('excluded');
        checkbox.checked = true;
    } else {
        element.classList.add('excluded');
        checkbox.checked = false;
    }
};

window.cancelarInline = function (btnAction) {
    const panel = btnAction.closest('.inline-customize');
    const cardInfo = panel.parentElement;
    panel.remove();

    const addBtn = cardInfo.querySelector('.product-btn');
    if (addBtn) addBtn.style.display = 'flex';
};

window.confirmarInline = function (btnAction, nombre, precio) {
    const panel = btnAction.closest('.inline-customize');

    const exclusiones = [];
    panel.querySelectorAll('.inline-ingredient-item.excluded').forEach(el => {
        exclusiones.push(el.getAttribute('data-name'));
    });

    procesarAgregarAlPedido(nombre, precio, exclusiones);

    // Restaurar el card
    const cardInfo = panel.parentElement;
    panel.remove();
    const addBtn = cardInfo.querySelector('.product-btn');
    if (addBtn) addBtn.style.display = 'flex';
};

function procesarAgregarAlPedido(nombre, precio, exclusiones) {
    // Buscar si ya existe el mismo producto con las MISMAS exclusiones
    const exclusionesStr = exclusiones.sort().join('|');
    const itemExistente = pedido.find(item =>
        item.nombre === nombre && item.exclusiones.sort().join('|') === exclusionesStr
    );

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        pedido.push({ nombre, precio, cantidad: 1, exclusiones: [...exclusiones] });
    }

    actualizarPedidoUI();
    mostrarToast(`Agregaste: ${nombre}`);
}

window.cambiarCantidad = function (index, delta) {
    if (pedido[index]) {
        pedido[index].cantidad += delta;
        if (pedido[index].cantidad <= 0) {
            pedido.splice(index, 1);
        }
        actualizarPedidoUI();
    }
};

window.eliminarItem = function (index) {
    pedido.splice(index, 1);
    actualizarPedidoUI();
};

window.limpiarPedido = function () {
    pedido = [];
    actualizarPedidoUI();
    togglePedido(); // Cerramos el panel también
};

window.togglePedido = function () {
    const panel = document.getElementById('pedido-panel');
    const overlay = document.getElementById('pedido-overlay');

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.classList.remove('active'), 300);
    } else {
        overlay.classList.add('active');
        overlay.style.opacity = '1';
        panel.classList.add('active');
    }
};

function actualizarPedidoUI() {
    const fabButton = document.getElementById('pedido-fab');
    const countBadge = document.getElementById('pedido-count');
    const itemsContainer = document.getElementById('pedido-items');
    const emptyState = document.getElementById('pedido-empty');
    const footer = document.getElementById('pedido-footer');
    const totalEl = document.getElementById('pedido-total');

    // Actualizar cantidad total
    const totalItems = pedido.reduce((sum, item) => sum + item.cantidad, 0);
    countBadge.innerText = totalItems;

    if (totalItems > 0) {
        fabButton.classList.add('visible');
        emptyState.style.display = 'none';
        itemsContainer.style.display = 'block';
        footer.style.display = 'block';

        // Renderizar items
        itemsContainer.innerHTML = pedido.map((item, index) => {
            const exclusionesHtml = item.exclusiones.length > 0
                ? `<div style="font-size: 0.8rem; color: #ef4444; margin-top: 0.25rem;">Sin: ${item.exclusiones.join(', ')}</div>`
                : '';

            return `
            <div class="pedido-item">
                <div class="pedido-item-info">
                    <div>
                        <h4 class="pedido-item-name">${item.nombre}</h4>
                        ${exclusionesHtml}
                    </div>
                </div>
                <div class="pedido-item-actions" style="margin-top: 0.75rem;">
                    <span class="pedido-item-price">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <div class="pedido-item-qty">
                            <button onclick="cambiarCantidad(${index}, -1)"><i data-lucide="minus" class="icon-sm"></i></button>
                            <span>${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${index}, 1)"><i data-lucide="plus" class="icon-sm"></i></button>
                        </div>
                        <button class="pedido-item-delete" onclick="eliminarItem(${index})"><i data-lucide="trash-2" class="icon-sm"></i></button>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // Recalcular Total
        const totalPesos = pedido.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        totalEl.innerText = `$${totalPesos.toLocaleString('es-CO')}`;

        lucide.createIcons();
    } else {
        fabButton.classList.remove('visible');
        emptyState.style.display = 'flex';
        itemsContainer.style.display = 'none';
        footer.style.display = 'none';

        // Si el panel está abierto y se vació el carrito, lo cerramos.
        const panel = document.getElementById('pedido-panel');
        if (panel.classList.contains('active')) {
            togglePedido();
        }
    }
}

window.enviarPedidoWhatsApp = function () {
    if (pedido.length === 0) return;

    let mensaje = "¡Hola Saboratto! 👋 Quiero hacer el siguiente pedido:%0A%0A";
    let totalPesos = 0;

    pedido.forEach(item => {
        let name = `🔸 ${item.cantidad}x ${item.nombre}`;
        if (item.exclusiones && item.exclusiones.length > 0) {
            name += ` (Sin: ${item.exclusiones.join(', ')})`;
        }
        mensaje += `${name} - $${(item.precio * item.cantidad).toLocaleString('es-CO')}%0A`;
        totalPesos += item.precio * item.cantidad;
    });

    mensaje += `%0A💰 *Total estimado: $${totalPesos.toLocaleString('es-CO')}*%0A%0A¡Muchas gracias!`;

    window.open(`https://wa.me/${numeroSaboratto}?text=${mensaje}`, '_blank');
};

function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    toastText.innerText = mensaje;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Global WhatsApp redirect fallback
window.enviarWhatsAppGeneral = function () {
    const msg = `¡Hola Saboratto! 👋 Quiero hacer un pedido, ¿me pueden tomar la orden por favor?`;
    window.open(`https://wa.me/${numeroSaboratto}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
};

window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
};

window.scrollGallery = function (direction) {
    const container = document.getElementById('gallery-container');
    const amount = container.clientWidth * 0.75;
    container.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
    });
};

// ===== BUSINESS HOURS =====
function updateBusinessHours() {
    const badgeTextNode = Array.from(document.querySelector('.hero-badge')?.childNodes || []).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
    const dotCore = document.querySelector('.hero-badge-core');
    const dotPing = document.querySelector('.hero-badge-ping');

    if (!badgeTextNode || !dotCore || !dotPing) return;

    const now = new Date();
    // Forzar la zona horaria a Colombia para asegurar exactitud si el cliente viaja o la config del ordenador varía (idealmente)
    // Pero usaremos la hora local asumiendo que el ordenador está en Colombia.
    const day = now.getDay();
    const hours = now.getHours();

    let isOpen = false;

    // Lunes = 1 (Cerrado)
    if (day >= 2 && day <= 4) {
        // Martes a Jueves: 7 PM (19:00) - 10 PM (22:00)
        if (hours >= 19 && hours < 22) isOpen = true;
    } else if (day >= 5 || day === 0) {
        // Viernes a Domingo: 6 PM (18:00) - 11 PM (23:00)
        if (hours >= 18 && hours < 23) isOpen = true;
    }

    if (isOpen) {
        badgeTextNode.textContent = " SABORATTO LIVE (ABIERTO)";
        dotCore.style.background = "#ea580c"; // orange/live color
        dotPing.style.background = "#ea580c";
        dotPing.style.animation = "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite";
        dotPing.style.display = "block";
    } else {
        badgeTextNode.textContent = " CERRADO AHORA";
        dotCore.style.background = "#6b7280"; // gray/offline
        dotPing.style.animation = "none";
        dotPing.style.display = "none";
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    updateBusinessHours();
    setInterval(updateBusinessHours, 60000); // Check every minute
});
