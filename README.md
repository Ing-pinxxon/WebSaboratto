# 🍔 Saboratto V2 - Web Experience

Bienvenido al repositorio oficial de la experiencia web de **Saboratto**. Esta plataforma permite a los clientes explorar nuestro menú artesanal, personalizar sus hamburguesas y realizar pedidos directamente a nuestro WhatsApp con un sistema automatizado de descuentos y cargos legales.

---

## 🚀 Inicio Rápido

Para correr este proyecto localmente, asegúrate de tener [Node.js](https://nodejs.org/) instalado y sigue estos pasos:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Correr en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción (Generar carpeta `dist`):**
   ```bash
   npm run build
   ```

---

## 🧠 Reglas de Negocio Implementadas

El sistema de pedidos está automatizado con las siguientes reglas configuradas:

1. **Beneficio Web:** Se aplica un **5% de descuento** automático sobre el subtotal de productos por realizar el pedido mediante la página.
2. **Costo de Domicilio:** Se incluye un cargo fijo de **$1.000** en todos los pedidos.
3. **Cargo de Icopor:** Se cobran **$500** por cada unidad de **Perros Calientes** o **Salchipapas** seleccionada. (Las hamburguesas no generan este cargo).
4. **Sistema de Combos:** Las hamburguesas pueden convertirse en combo por **+$6.000**, lo cual incluye automáticamente Papas y Gaseosa Coca-Cola Cero.

---

## 🛠️ Arquitectura del Proyecto

El código ha sido modularizado para facilitar el mantenimiento:

- `src/main.js`: Punto de entrada y orquestador de la aplicación.
- `src/cart.js`: Lógica del carrito de compras, cálculos de precios y generación de mensajes de WhatsApp.
- `src/animations.js`: Control de animaciones GSAP, ScrollTrigger y efectos visuales.
- `src/style.css`: Sistema de diseño basado en variables CSS personalizadas.

---

## 🌐 Despliegue

- **GitHub Pages:** [https://ing-pinxxon.github.io/WebSaboratto/](https://ing-pinxxon.github.io/WebSaboratto/)
- **Vercel:** Automatizado para desplegar desde la rama `main`.

---

© 2026 Saboratto - Sabor Único Artesanal.
