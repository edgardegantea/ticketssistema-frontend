import { useEffect, useState } from 'react';
import { httpClient } from '../../services/httpClient.js';

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forbidden, setForbidden] = useState(false);

    const [page, setPage] = useState(1);
    const [perPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    const [estado, setEstado] = useState('');
    const [prioridad, setPrioridad] = useState('');

    useEffect(() => {
        fetchTickets(page, estado, prioridad);
    }, [page, estado, prioridad]);

    async function fetchTickets(pageToLoad = 1, estadoFilter = '', prioridadFilter = '') {
        try {
            setLoading(true);
            setError(null);
            setForbidden(false);

            const params = new URLSearchParams({
                page: pageToLoad.toString(),
                perPage: perPage.toString(),
            });

            if (estadoFilter) params.append('estado', estadoFilter);
            if (prioridadFilter) params.append('prioridad', prioridadFilter);

            const res = await httpClient.get(`/admin/tickets?${params.toString()}`);

            setTickets(res.data || []);
            setTotal(res.total ?? 0);
            setPageCount(res.pageCount ?? 1);
        } catch (err) {
            if (err.status === 403) {
                setForbidden(true);
                setError('No tienes permisos para ver los tickets.');
            } else if (err.status === 401) {
                setError('Tu sesión ha expirado, vuelve a iniciar sesión.');
            } else {
                setError(err.message || 'Error cargando tickets');
            }
        } finally {
            setLoading(false);
        }
    }

    function handlePrev() {
        setPage((p) => Math.max(1, p - 1));
    }

    function handleNext() {
        setPage((p) => Math.min(pageCount, p + 1));
    }

    function handleEstadoChange(e) {
        setPage(1);
        setEstado(e.target.value);
    }

    function handlePrioridadChange(e) {
        setPage(1);
        setPrioridad(e.target.value);
    }

    if (loading) return <div>Cargando tickets...</div>;

    if (forbidden) {
        return (
            <div>
                <h1>Acceso denegado</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Tickets</h1>
            <p>Listado de tickets de soporte.</p>

            {/* Filtros */}
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 12,
                    fontSize: 13,
                }}
            >
                <div>
                    <label>
                        Estado:{' '}
                        <select value={estado} onChange={handleEstadoChange}>
                            <option value="">Todos</option>
                            <option value="abierto">Abierto</option>
                            <option value="en progreso">En progreso</option>
                            <option value="cerrado">Cerrado</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Prioridad:{' '}
                        <select value={prioridad} onChange={handlePrioridadChange}>
                            <option value="">Todas</option>
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>
                    </label>
                </div>
            </div>

            {error && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: 8, fontSize: 13 }}>
                Mostrando página {page} de {pageCount} — Total: {total} tickets
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                    }}
                >
                    <thead>
                    <tr style={{ backgroundColor: '#e5e7eb' }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Título</th>
                        <th style={thStyle}>Estado</th>
                        <th style={thStyle}>Prioridad</th>
                        <th style={thStyle}>Creado por</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((t) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={tdStyle}>{t.id}</td>
                            <td style={tdStyle}>{t.titulo}</td>
                            <td style={tdStyle}>{t.estado}</td>
                            <td style={tdStyle}>{t.prioridad}</td>
                            <td style={tdStyle}>{t.creado_por}</td>
                        </tr>
                    ))}
                    {tickets.length === 0 && (
                        <tr>
                            <td style={tdStyle} colSpan={5}>
                                No hay tickets que coincidan con los filtros.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    marginTop: 12,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                }}
            >
                <button
                    onClick={handlePrev}
                    disabled={page <= 1}
                    style={{ padding: '4px 8px' }}
                >
                    Anterior
                </button>
                <span style={{ fontSize: 13 }}>
          Página {page} de {pageCount}
        </span>
                <button
                    onClick={handleNext}
                    disabled={page >= pageCount}
                    style={{ padding: '4px 8px' }}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

const thStyle = {
    textAlign: 'left',
    padding: '8px 10px',
    fontSize: 13,
};

const tdStyle = {
    padding: '8px 10px',
    fontSize: 13,
};
