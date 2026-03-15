import { useEffect, useState } from 'react';
import { httpClient } from '../../services/httpClient.js';
import { useNavigate } from "react-router-dom";
import { getEstadoBadgeStyle, getPrioridadBadgeStyle } from '../../styles/badges.js';


export default function Tickets() {

    const navigate = useNavigate();

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

    const [selectedIds, setSelectedIds] = useState([]);
    const [showDeleted, setShowDeleted] = useState('active');


    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');


    const [sortBy, setSortBy] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc'); // asc | desc


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



    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchInput]);


    useEffect(() => {
        fetchTickets(page, estado, prioridad, showDeleted, search, sortBy, sortDir);
    }, [page, estado, prioridad, showDeleted, search, sortBy, sortDir]);


    async function fetchTickets(
        pageToLoad = 1,
        estadoFilter = '',
        prioridadFilter = '',
        showDeletedFilter = showDeleted,
        searchFilter = search,
        sortByFilter = sortBy,
        sortDirFilter = sortDir

    ) {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: pageToLoad.toString(),
                perPage: perPage.toString(),
                sortBy: sortByFilter,
                sortDir: sortDirFilter,
            });

            if (estadoFilter) params.append('estado', estadoFilter);
            if (prioridadFilter) params.append('prioridad', prioridadFilter);

            if (showDeletedFilter === 'all') {
                params.append('showDeleted', 'all');
            } else if (showDeletedFilter === 'only') {
                params.append('showDeleted', 'only');
            }

            if (searchFilter) {
                params.append('search', searchFilter);
            }

            const res = await httpClient.get(`/admin/tickets?${params.toString()}`);

            setTickets(res.data ?? []);
            setPageCount(res.pageCount ?? 1);
            setTotal(res.total ?? 0);

            // si cambió el conjunto de tickets, limpia selección
            setSelectedIds([]);
        } catch (err) {
            setError(err.message || 'Error cargando tickets');
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


    async function updateTicketField(id, payload) {
        try {
            await httpClient.patch(`/admin/tickets/${id}`, payload);
            // recargar página actual para ver cambios reflejados
            fetchTickets(page, estado, prioridad);
        } catch (err) {
            console.error('Error actualizando ticket', err);
            alert(err.message || 'Error actualizando ticket');
        }
    }

    function handleChangeEstado(id, nuevoEstado) {
        updateTicketField(id, { estado: nuevoEstado });
    }

    function handleChangePrioridad(id, nuevaPrioridad) {
        updateTicketField(id, { prioridad: nuevaPrioridad });
    }


    async function handleDeleteTicket(id) {
        const confirmar = window.confirm(`¿Seguro que deseas eliminar el ticket #${id}?`);
        if (!confirmar) return;

        try {
            await httpClient.delete(`/admin/tickets/${id}`);
            // recargar la página actual
            fetchTickets(page, estado, prioridad);
        } catch (err) {
            console.error('Error eliminando ticket', err);
            alert(err.message || 'Error eliminando ticket');
        }
    }


    async function handleBulkDelete() {
        if (selectedIds.length === 0) return;

        const confirmar = window.confirm(
            `¿Seguro que deseas eliminar ${selectedIds.length} ticket(s)?`
        );
        if (!confirmar) return;

        try {
            await httpClient.post('/admin/tickets/bulk-delete', {
                ids: selectedIds,
            });
            setSelectedIds([]);
            fetchTickets(page, estado, prioridad);
        } catch (err) {
            console.error('Error eliminando tickets', err);
            alert(err.message || 'Error eliminando tickets');
        }
    }



    function toggleSelect(id) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    function toggleSelectAll() {
        if (selectedIds.length === tickets.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tickets.map((t) => t.id));
        }
    }



    function handleSort(newSortBy) {
        setPage(1);
        setSortBy((currentSortBy) => {
            if (currentSortBy === newSortBy) {
                setSortDir((currentSortDir) => (currentSortDir === 'asc' ? 'desc' : 'asc'));
                return currentSortBy;
            }
            // nuevo campo → reinicia a desc
            setSortDir('desc');
            return newSortBy;
        });
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




            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 12,
                    fontSize: 13,
                }}
            >

                <input
                    type="text"
                    placeholder="Buscar por título, descripción o creador..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                        padding: '6px 8px',
                        fontSize: 14,
                        borderRadius: 4,
                        border: '1px solid #d1d5db',
                        minWidth: 220,
                    }}
                />

            </div>



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


                    <button onClick={() => navigate('/admin/tickets/nuevo')} style={{marginRight: 20}}>
                        Nuevo ticket
                    </button>


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


                <label style={{ fontSize: 14 }}>
                    Mostrar:
                    <select
                        value={showDeleted}
                        onChange={(e) => {
                            setShowDeleted(e.target.value);
                            setPage(1);
                        }}
                        style={{ marginLeft: 6 }}
                    >
                        <option value="active">Solo activos</option>
                        <option value="all">Activos y eliminados</option>
                        <option value="only">Solo eliminados</option>
                    </select>
                </label>





            </div>


            {selectedIds.length > 0 && (
                <div
                    style={{
                        marginBottom: 12,
                        padding: 8,
                        backgroundColor: '#fee2e2',
                        borderRadius: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 14,
                    }}
                >
    <span>
      {selectedIds.length} ticket
        {selectedIds.length > 1 ? 's' : ''} seleccionados
    </span>
                    <button
                        style={{
                            padding: '4px 10px',
                            backgroundColor: '#b91c1c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 13,
                        }}
                        onClick={handleBulkDelete}
                    >
                        Eliminar seleccionados
                    </button>
                </div>
            )}



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
                        <th style={thStyle}>
                            <input
                                type="checkbox"
                                checked={tickets.length > 0 && selectedIds.length === tickets.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th
                            style={{ ...thStyle, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            onClick={() => handleSort('id')}
                        >
                            ID {sortBy === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                        </th>

                        <th
                            style={{ ...thStyle, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            onClick={() => handleSort('titulo')}
                        >
                            Título {sortBy === 'titulo' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={thStyle}>Estado</th>
                        <th style={thStyle}>Prioridad</th>
                        <th style={thStyle}>Creado por</th>
                        <th style={thStyle}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((t) => (
                        <tr key={t.id}>
                            <td style={tdStyle}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(t.id)}
                                    onChange={() => toggleSelect(t.id)}
                                />
                            </td>

                            <td style={tdStyle}>{t.id}</td>
                            <td style={tdStyle}>
                                <button
                                    style={{ padding: 0, border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer' }}
                                    onClick={() => navigate(`/admin/tickets/${t.id}`)}
                                >
                                    {t.titulo}
                                </button>
                            </td>
                            <td style={tdStyle}>
                                <div style={getEstadoBadgeStyle(t.estado)}>
                                    <select
                                        value={t.estado}
                                        onChange={(e) => handleChangeEstado(t.id, e.target.value)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: 'inherit',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            outline: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="abierto">Abierto</option>
                                        <option value="en_progreso">En progreso</option>
                                        <option value="cerrado">Cerrado</option>
                                    </select>
                                </div>
                            </td>

                            <td style={tdStyle}>
                                <div style={getPrioridadBadgeStyle(t.prioridad)}>
                                    <select
                                        value={t.prioridad}
                                        onChange={(e) => handleChangePrioridad(t.id, e.target.value)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: 'inherit',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            outline: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="baja">Baja</option>
                                        <option value="media">Media</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                </div>
                            </td>
                            <td style={tdStyle}>{t.creado_por}</td>
                            <td style={tdStyle}>
                                <button
                                    style={{
                                        marginLeft: 8,
                                        padding: '4px 8px',
                                        backgroundColor: '#dc2626',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        fontSize: 12,
                                    }}
                                    onClick={() => handleDeleteTicket(t.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
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
