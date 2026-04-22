const numeroSaboratto = '573222430079';

export let pedido = [];

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
    'Salsa cheddar': '🧀',
    'Queso criollo fundido': '🧀',
    'Maíz tierno asado': '🌽',
    'Plátano maduro': '🍌',
    'Salsa BBQ': '🫙'
};

export function initCartUI(actualizarPedidoUI) {
    window.agregarAlPedido = function (nombre, precio, btnEl, esCombo = false) {
        if (INGREDIENTES_REMOVIBLES[nombre] && btnEl) {
            mostrarOpcionesInline(nombre, precio, btnEl, esCombo);
        } else {
            procesarAgregarAlPedido(nombre, precio, [], esCombo);
        }
    };

    window.mostrarOpcionesInline = function (nombre, precio, btnEl, esCombo = false) {
        const cardInfo = btnEl.parentElement;
        if (cardInfo.querySelector('.inline-customize')) return;

        if (cardInfo.classList.contains('product-actions-grid')) {
            cardInfo.style.display = 'none';
        } else {
            btnEl.style.display = 'none';
        }

        const panel = document.createElement('div');
        panel.className = 'inline-customize';
        panel.style.animation = 'fadeInUp 0.3s ease';

        let html = `<p class="inline-customize-title">${esCombo ? '🌟 ¡Combo activado! ' : ''}¿Quitar algo?</p><div class="inline-ingredients">`;

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
                <button onclick="confirmarInline(this, '${nombre}', ${precio}, ${esCombo})" class="btn-confirm-inline">Confirmar</button>
            </div>
        `;

        panel.innerHTML = html;
        if (cardInfo.classList.contains('product-actions-grid')) {
            cardInfo.parentElement.appendChild(panel);
        } else {
            cardInfo.appendChild(panel);
        }
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
        const container = panel.parentElement;
        panel.remove();
        const actionsGrid = container.querySelector('.product-actions-grid');
        if (actionsGrid) {
            actionsGrid.style.display = 'grid';
        } else {
            const addBtn = container.querySelector('.product-btn') || container.querySelector('.vmodal-btn-order');
            if (addBtn) addBtn.style.display = 'flex';
        }
    };

    window.confirmarInline = function (btnAction, nombre, precio, esCombo = false) {
        const panel = btnAction.closest('.inline-customize');
        const exclusiones = [];
        panel.querySelectorAll('.inline-ingredient-item.excluded').forEach(el => {
            exclusiones.push(el.getAttribute('data-name'));
        });
        procesarAgregarAlPedido(nombre, precio, exclusiones, esCombo);
        
        const container = panel.parentElement;
        panel.remove();
        
        const actionsGrid = container.querySelector('.product-actions-grid');
        if (actionsGrid) {
            actionsGrid.style.display = 'grid';
        } else {
            const addBtn = container.querySelector('.product-btn') || container.querySelector('.vmodal-btn-order');
            if (addBtn) addBtn.style.display = 'flex';
        }

        // Si se estaba personalizando desde el modal, cerrarlo al terminar
        if (container.classList.contains('vmodal-actions')) {
            if (typeof closeVideoModal === 'function') {
                closeVideoModal();
            }
        }
    };

    window.cambiarCantidad = function (index, delta) {
        if (pedido[index]) {
            pedido[index].cantidad += delta;
            if (pedido[index].cantidad <= 0) pedido.splice(index, 1);
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
        window.togglePedido();
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

    function procesarAgregarAlPedido(nombre, precio, exclusiones, esCombo = false) {
        const exclusionesStr = exclusiones.sort().join('|');
        const itemExistente = pedido.find(item =>
            item.nombre === nombre && 
            item.exclusiones.sort().join('|') === exclusionesStr &&
            item.esCombo === esCombo
        );

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            pedido.push({ nombre, precio, cantidad: 1, exclusiones: [...exclusiones], esCombo });
        }
        actualizarPedidoUI();
        window.mostrarToast(`Agregaste: ${nombre}${esCombo ? ' (Combo)' : ''}`);
    }
}

export function enviarPedidoWhatsApp() {
    if (pedido.length === 0) return;

    let mensaje = "¡Hola Saboratto! 👋 Quiero hacer el siguiente pedido mediante la página web:%0A%0A";
    let subtotal = 0;
    let unidadesIcopor = 0;

    pedido.forEach(item => {
        let emojiProducto = "🍔";
        const n = item.nombre.toLowerCase();
        if (n.includes('perro')) { emojiProducto = "🌭"; unidadesIcopor += item.cantidad; }
        else if (n.includes('salchipapa')) { emojiProducto = "🍟"; unidadesIcopor += item.cantidad; }
        else if (n.includes('sándwich')) { emojiProducto = "🥪"; }
        else if (n.includes('coca') || n.includes('gaseosa') || n.includes('pepsi') || n.includes('manzana') || n.includes('colombiana')) { emojiProducto = "🥤"; }

        if (item.esCombo) {
            mensaje += `• ${item.cantidad} Combo ${item.nombre} 🍱 - $${(item.precio * item.cantidad).toLocaleString('es-CO')}%0A`;
            mensaje += `  – Incluye: Papas + Coca-Cola Cero%0A`;
        } else {
            mensaje += `• ${item.cantidad} ${item.nombre} ${emojiProducto} - $${(item.precio * item.cantidad).toLocaleString('es-CO')}%0A`;
        }
        if (item.exclusiones && item.exclusiones.length > 0) mensaje += `  – Sin: ${item.exclusiones.join(', ')}%0A`;
        subtotal += item.precio * item.cantidad;
        mensaje += "%0A";
    });

    const descuento = subtotal * 0.05;
    const totalConDescuento = subtotal - descuento;
    const costoIcopor = unidadesIcopor * 500;
    const costoDomicilio = 1000;
    const granTotal = totalConDescuento + costoIcopor + costoDomicilio;

    if (pedido.length > 1 || subtotal !== totalConDescuento) mensaje += `Subtotal: $${subtotal.toLocaleString('es-CO')}%0A`;
    mensaje += `Descuento página web (5%): -$${descuento.toLocaleString('es-CO')}%0A`;
    if (costoIcopor > 0) mensaje += `Icopor: $${costoIcopor.toLocaleString('es-CO')} (${unidadesIcopor} unidades)%0A`;
    mensaje += `Domicilio: $${costoDomicilio.toLocaleString('es-CO')}%0A`;
    mensaje += `*Total: $${granTotal.toLocaleString('es-CO')}*`;

    window.open(`https://wa.me/${numeroSaboratto}?text=${mensaje}`, '_blank');
}
