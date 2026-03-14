import { useEffect, useState } from 'react';
import { httpClient } from '../../services/httpClient.js';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summaryError, setSummaryError] = useState(null);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        fetchDashboard();
        fetchSummary();
    }, []);

    async function fetchDashboard() {
        try {
            setLoading(true);
            setError(null);
            setForbidden(false);

            const res = await httpClient.get('/admin/dashboard');
            setData(res);
        } catch (err) {
            if (err.status === 403) {
                setForbidden(true);
                setError('No tienes permisos para acceder al panel de administración.');
            } else {
                setError(err.message || 'Error cargando dashboard');
            }
        } finally {
            setLoading(false);
        }
    }

    async function fetchSummary() {
        try {
            setSummaryLoading(true);
            setSummaryError(null);

            const res = await httpClient.get('/admin/tickets/summary');
            setSummary(res);
        } catch (err) {
            setSummaryError(err.message || 'Error cargando resumen de tickets');
        } finally {
            setSummaryLoading(false);
        }
    }

    if (loading) return <div>Cargando dashboard...</div>;

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
            <h1>Dashboard</h1>
            <p>Resumen general del sistema.</p>

            {error && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {error}
                </div>
            )}

            {/* Tarjetas de resumen */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    marginBottom: 24,
                }}
            >
                <SummaryCard
                    title="Tickets totales"
                    value={summaryLoading ? '...' : summary?.total ?? 0}
                />
                <SummaryCard
                    title="Abiertos"
                    value={summaryLoading ? '...' : summary?.abiertos ?? 0}
                />
                <SummaryCard
                    title="En progreso"
                    value={summaryLoading ? '...' : summary?.enProgreso ?? 0}
                />
                <SummaryCard
                    title="Cerrados"
                    value={summaryLoading ? '...' : summary?.cerrados ?? 0}
                />
            </div>

            {summaryError && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {summaryError}
                </div>
            )}

            <section>
                <h2>Datos del endpoint /admin/dashboard</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </section>
        </div>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div
            style={{
                minWidth: 140,
                padding: 12,
                borderRadius: 8,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
        >
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                {title}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
        </div>
    );
}
