/**
 * Lógica para verificar el estado de apertura de Saboratto
 * Horario Colombia (UTC-5)
 * Lunes: Cerrado
 * Martes - Jueves: 7:00 PM - 10:00 PM (19:00 - 22:00)
 * Viernes - Domingo: 6:00 PM - 11:00 PM (18:00 - 23:00)
 */

export function initStatusIndicator() {
    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');
    const statusPing = document.getElementById('status-ping');

    if (!statusText || !statusDot) return;

    function updateStatus() {
        // Obtener fecha y hora en Colombia
        const now = new Date();
        const options = { timeZone: 'America/Bogota', hour12: false };
        const colombiaTimeStr = now.toLocaleString('es-CO', options);
        
        // El formato de es-CO puede variar según el entorno, 
        // así que usamos Intl.DateTimeFormat para mayor seguridad
        const formatter = new Intl.DateTimeFormat('es-CO', {
            timeZone: 'America/Bogota',
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'long',
            hour12: false
        });
        
        const parts = formatter.formatToParts(now);
        const getTimePart = (type) => parts.find(p => p.type === type).value;
        
        const dayName = getTimePart('weekday').toLowerCase(); // lunes, martes...
        const hour = parseInt(getTimePart('hour'));
        const minute = parseInt(getTimePart('minute'));
        const currentTime = hour + minute / 60;

        let isOpen = false;
        let nextOpening = '';

        // Lógica de horarios
        if (dayName === 'lunes') {
            isOpen = false;
            nextOpening = 'Abre mañana a las 7:00 PM';
        } else if (['martes', 'miércoles', 'miercoles', 'jueves'].includes(dayName)) {
            if (currentTime >= 19 && currentTime < 22) {
                isOpen = true;
            } else {
                isOpen = false;
                nextOpening = currentTime < 19 ? 'Abre hoy a las 7:00 PM' : 'Abre mañana a las 7:00 PM';
            }
        } else if (['viernes', 'sábado', 'sabado', 'domingo'].includes(dayName)) {
            if (currentTime >= 18 && currentTime < 23) {
                isOpen = true;
            } else {
                isOpen = false;
                nextOpening = currentTime < 18 ? 'Abre hoy a las 6:00 PM' : (dayName === 'domingo' ? 'Cerrado hasta el martes' : 'Abre mañana a las 6:00 PM');
            }
        }

        // Actualizar UI
        if (isOpen) {
            statusText.innerText = 'Abierto Ahora';
            statusDot.className = 'hero-badge-core status-open';
            if (statusPing) statusPing.className = 'hero-badge-ping status-open-ping';
        } else {
            statusText.innerText = `Cerrado • ${nextOpening}`;
            statusDot.className = 'hero-badge-core status-closed';
            if (statusPing) statusPing.className = 'hero-badge-ping status-closed-ping';
        }
    }

    updateStatus();
    // Actualizar cada minuto
    setInterval(updateStatus, 60000);
}
