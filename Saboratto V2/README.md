# Saboratto V2 - Web Project

Este documento contiene la información técnica esencial sobre la estructura y estado actual del proyecto, ideal para informar a otros desarrolladores o Asistentes de IA (agentes) sobre cómo está configurado el entorno de **Saboratto V2**.

## 🛠️ Stack Tecnológico y Servidor

- **Entorno de Desarrollo:** [Vite](https://vitejs.dev/)
- **Gestión de Paquetes:** npm / node_modules
- **Estructura:** Vanilla JS con ES6 Modules (`import` / `export`)
- **Comando principal de inicio:** `npm run dev` (o ejecutar `vite` directamente si está instalado globalmente).

> **⚠️ IMPORTANTE PARA FUTUROS AGENTES:** 
> El servidor que rige y compila en tiempo real este proyecto es **Vite**. Las importaciones de JavaScript, como `import gsap from 'gsap'`, dependen estrictamente de que el entorno sea ejecutado a través de Vite. No se deben alterar los archivos para emular un servidor genérico (Python HTTP Server, Live Server convencional) sin empaquetador, ya que romperá las importaciones de los módulos ES6 y la resolución estática de la carpeta `public/`.

## ✨ Funcionalidades Principales Implementadas

### 1. Animación Hero con GSAP
- **Librería:** GSAP + ScrollTrigger (`npm install gsap`).
- **Lógica principal:** Ubicada en `src/main.js`.
- **Estructura:** Se utiliza un video iterativo autolocalizado en `#hero-img` (`hamburguesa_saboratto.mp4`).
- **Comportamiento:** El video se reproduce normalmente, pero gracias a ScrollTrigger y un efecto Parallax, flota, se escala y se adapta según la posición del scroll del usuario en la pantalla.
- **Parallax Adicional:** La misma línea de tiempo de GSAP (timeline) maneja movimientos sobre etiquetas de promoción flotantes y destellos (*glows*).

### 2. Estilos y Estructura CSS
- El núcleo CSS y la mayoría de utilidades habitan en `src/style.css` y es importado de forma nativa a través de Vite en `main.js`.

### 3. Pedidos por WhatsApp
- Hay una lógica de carrito de compras implementada en Vanilla JS dentro de `src/main.js`. 
- Genera cadenas de texto programáticamente vinculadas con la pasarela nativa web de WhatsApp con número en código cerrado (`numeroSaboratto`).

## 📁 Estructura Principal de Directorios
```text
Saboratto V2/
├── public/                 # Archivos estáticos crudos que Vite sirve en raíz (/)
│   ├── fotogramas/         # 64 imágenes optimizadas de la hamburguesa para JS Canvas
│   ├── logo-saboratto.png
│   └── (Otras imágenes de productos)
├── src/                    # Código fuente (Vite procesará esto)
│   ├── main.js             # Lógica de Inicialización, GSAP y Carrito
│   └── style.css           # Estilos principales de la web
├── index.html              # Punto de entrada HTML montado con <script type="module" src="/src/main.js">
├── package.json            # Dependencias del proyecto (Vite, GSAP)
└── README.md               # Este archivo de documentación
```

## 🔄 Próximos pasos
El estado global es estable y la animación se verifica funcionando. Cualquier futuro trabajo visual o lógico de JS debe integrarse a través de la carpeta `src/` e importar sus módulos en `main.js`.
