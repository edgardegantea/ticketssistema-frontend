const badgeBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
    border: '1px solid transparent',
};

export function getEstadoBadgeStyle(estado) {
    switch (estado) {
        case 'abierto':
            return {
                ...badgeBase,
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                borderColor: '#93c5fd',
            };
        case 'en_progreso':
            return {
                ...badgeBase,
                backgroundColor: '#fef9c3',
                color: '#92400e',
                borderColor: '#facc15',
            };
        case 'cerrado':
            return {
                ...badgeBase,
                backgroundColor: '#e5e7eb',
                color: '#374151',
                borderColor: '#d1d5db',
            };
        default:
            return badgeBase;
    }
}

export function getPrioridadBadgeStyle(prioridad) {
    switch (prioridad) {
        case 'alta':
            return {
                ...badgeBase,
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderColor: '#fca5a5',
            };
        case 'media':
            return {
                ...badgeBase,
                backgroundColor: '#ffedd5',
                color: '#c2410c',
                borderColor: '#fed7aa',
            };
        case 'baja':
            return {
                ...badgeBase,
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderColor: '#bbf7d0',
            };
        default:
            return badgeBase;
    }
}
