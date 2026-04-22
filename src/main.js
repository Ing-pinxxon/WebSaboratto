import './style.css';
import { initAnimations, initAutoScroll, initScrollAnimations, initParallax } from './animations';
import { initCartUI, enviarPedidoWhatsApp, pedido } from './cart';
import { initStatusIndicator } from './status';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCartUI(actualizarPedidoUI);
    initAutoScroll();
    initStatusIndicator();
    
    // Global functions exposure
    window.enviarPedidoWhatsApp = enviarPedidoWhatsApp;
    window.mostrarToast = mostrarToast;
    window.enviarWhatsAppGeneral = enviarWhatsAppGeneral;
    window.scrollToSection = scrollToSection;
    window.toggleMobileMenu = toggleMobileMenu;
    window.scrollGallery = scrollGallery;
    window.closeVideoModal = closeVideoModal;

    if (window.lucide) lucide.createIcons();
});

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    if (!preloader) return;

    // We keep animation here to ensure immediate execution on load
    import('gsap').then(({ default: gsap }) => {
        gsap.to('.preloader-logo', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
        gsap.to('.preloader-text', { opacity: 1, duration: 0.5, delay: 0.3 });
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
                        initAnimations(initNavbar, initParallax);
                        // Mostrar modal de video tras el preloader
                        initVideoModal();
                    }
                });
            }
        });
    });
}

// ===== VIDEO ANNOUNCEMENT MODAL =====
function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const closeBtn = document.getElementById('video-modal-close');
    if (!modal) return;

    // Mostrar el modal con animación
    modal.style.display = 'flex';

    // Recrear los iconos Lucide dentro del modal
    if (window.lucide) lucide.createIcons();

    // Cerrar con el botón X
    closeBtn?.addEventListener('click', closeVideoModal);

    // Cerrar al hacer clic en el backdrop (fuera de la tarjeta)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeVideoModal();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVideoModal();
    }, { once: true });
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    if (!modal || modal.classList.contains('closing')) return;

    modal.classList.add('closing');
    if (video) {
        video.pause();
    }
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
        // Resetear estado del botón de sonido
        resetVideoSound();
    }, 400);
}

// Función para controlar el sonido del video
window.toggleVideoSound = function() {
    const video = document.getElementById('modal-video');
    const iconOff = document.getElementById('sound-icon-off');
    const iconOn = document.getElementById('sound-icon-on');
    const text = document.getElementById('sound-text');
    const btn = document.getElementById('vmodal-sound-btn');
    
    if (!video) return;

    if (video.muted) {
        // Activar sonido
        video.muted = false;
        video.volume = 1;
        iconOff.classList.add('hidden');
        iconOn.classList.remove('hidden');
        text.innerText = "Sonido activado";
        btn.style.animation = "none"; // Quitar pulso
        btn.style.background = "rgba(10, 10, 12, 0.8)";
    } else {
        // Desactivar sonido
        video.muted = true;
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
        text.innerText = "Activar sonido";
        btn.style.animation = "vSoundPulse 2s infinite";
        btn.style.background = "rgba(234, 88, 12, 0.9)";
    }
};

function resetVideoSound() {
    const video = document.getElementById('modal-video');
    const iconOff = document.getElementById('sound-icon-off');
    const iconOn = document.getElementById('sound-icon-on');
    const text = document.getElementById('sound-text');
    const btn = document.getElementById('vmodal-sound-btn');
    
    if (video) video.muted = true;
    if (iconOff) iconOff.classList.remove('hidden');
    if (iconOn) iconOn.classList.add('hidden');
    if (text) text.innerText = "Activar sonido";
    if (btn) {
        btn.style.animation = "vSoundPulse 2s infinite";
        btn.style.background = "rgba(234, 88, 12, 0.9)";
    }
}

// Función específica para pedir La Master desde el modal
window.pedirLaMaster = function() {
    // Mostrar el modal de combo personalizado
    const comboModal = document.getElementById('combo-modal');
    if (comboModal) {
        comboModal.style.display = 'flex';
    }
};

window.cerrarComboModal = function() {
    const comboModal = document.getElementById('combo-modal');
    if (comboModal) {
        comboModal.style.display = 'none';
    }
};

window.confirmarMasterCombo = function(quiereCombo) {
    if (quiereCombo) {
        agregarAlPedido('Hamburguesa La Master', 27000, null, true);
    } else {
        agregarAlPedido('Hamburguesa La Master', 21000, null, false);
    }
    
    // Cerrar el modal de combo
    cerrarComboModal();
    // Cerrar el modal de video original
    closeVideoModal();
};

function initNavbar() {
    const nav = document.getElementById('navbar');
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
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
    });
}

function actualizarPedidoUI() {
    const fabButton = document.getElementById('pedido-fab');
    const countBadge = document.getElementById('pedido-count');
    const itemsContainer = document.getElementById('pedido-items');
    const emptyState = document.getElementById('pedido-empty');
    const footer = document.getElementById('pedido-footer');
    const totalEl = document.getElementById('pedido-total');

    const totalItems = pedido.reduce((sum, item) => sum + item.cantidad, 0);
    countBadge.innerText = totalItems;

    if (totalItems > 0) {
        fabButton.classList.add('visible');
        emptyState.style.display = 'none';
        itemsContainer.style.display = 'block';
        footer.style.display = 'block';

        itemsContainer.innerHTML = pedido.map((item, index) => {
            const exclusionesHtml = item.exclusiones.length > 0
                ? `<div style="font-size: 0.8rem; color: #ef4444; margin-top: 0.25rem;">Sin: ${item.exclusiones.join(', ')}</div>`
                : '';
            return `
            <div class="pedido-item">
                <div class="pedido-item-info">
                    <div>
                        <h4 class="pedido-item-name">${item.nombre} ${item.esCombo ? '(Combo)' : ''}</h4>
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
            </div>`;
        }).join('');

        const subtotal = pedido.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        // Calcular icopor (500 por cada perro/salchipapa)
        let unidadesIcopor = 0;
        pedido.forEach(item => {
            const n = item.nombre.toLowerCase();
            if (n.includes('perro') || n.includes('salchipapa')) {
                unidadesIcopor += item.cantidad;
            }
        });

        const descuento = subtotal * 0.05;
        const costoIcopor = unidadesIcopor * 500;
        const costoDomicilio = 1000;
        const totalFinal = (subtotal - descuento) + costoIcopor + costoDomicilio;

        totalEl.innerHTML = `
            <div class="pedido-total-breakdown">
                <div class="breakdown-row"><span>Subtotal:</span> <span>$${subtotal.toLocaleString('es-CO')}</span></div>
                <div class="breakdown-row discount"><span>Desc. Web (5%):</span> <span>-$${descuento.toLocaleString('es-CO')}</span></div>
                ${unidadesIcopor > 0 ? `<div class="breakdown-row"><span>Icopor:</span> <span>$${costoIcopor.toLocaleString('es-CO')}</span></div>` : ''}
                <div class="breakdown-row"><span>Domicilio:</span> <span>$${costoDomicilio.toLocaleString('es-CO')}</span></div>
                <div class="breakdown-row total-row"><span>Total:</span> <span>$${totalFinal.toLocaleString('es-CO')}</span></div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    } else {
        fabButton.classList.remove('visible');
        emptyState.style.display = 'flex';
        itemsContainer.style.display = 'none';
        footer.style.display = 'none';
        if (document.getElementById('pedido-panel').classList.contains('active')) window.togglePedido();
    }
}

function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.innerText = mensaje;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function enviarWhatsAppGeneral() {
    const msg = `¡Hola Saboratto! 👋 Quiero hacer un pedido, ¿me pueden tomar la orden por favor?`;
    window.open(`https://wa.me/573222430079?text=${encodeURIComponent(msg)}`, '_blank');
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function scrollGallery(direction) {
    const container = document.getElementById('gallery-container');
    if (!container) return;
    
    // Notificar al sistema de auto-scroll que se pause
    container.dispatchEvent(new CustomEvent('pause-autoscroll'));
    
    const amount = container.clientWidth * 0.75;
    const targetScroll = container.scrollLeft + (direction === 'left' ? -amount : amount);
    
    container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });

    // Si llegamos a los límites del loop infinito (aunque los botones suelen ser para navegación finita)
    // El clon ya ayuda a que no se vea vacío, pero aquí manejamos los saltos si es necesario
    setTimeout(() => {
        if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft -= container.scrollWidth / 2;
        } else if (container.scrollLeft <= 0 && direction === 'left') {
            container.scrollLeft += container.scrollWidth / 2;
        }
    }, 500); // Esperar a que termine el smooth scroll
}
