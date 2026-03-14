import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { httpClient } from '../../services/httpClient.js';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        try {
            setLoading(true);
            setError(null);
            setForbidden(false);

            const res = await httpClient.get('/admin/dashboard');
            setData(res);
        } catch (err) {
            if (err.status === 401) {
                setError('Tu sesión ha expirado o no estás autenticado.');
            } else if (err.status === 403) {
                setForbidden(true);
                setError('No tienes permisos para acceder al panel de administración.');
            } else {
                setError(err.message || 'Error cargando dashboard');
            }
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        logout();
    }

    if (loading) return <div>Cargando dashboard...</div>;

    if (forbidden) {
        return (
            <div style={{ padding: 24 }}>
                <h1>Acceso denegado</h1>
                <p>{error}</p>
                <p>Inicia sesión con una cuenta de administrador.</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <header
                style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <h1>Panel de administración</h1>
                    <p>Bienvenido, {user?.email}</p>
                </div>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </header>

            {error && !forbidden && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {error}
                </div>
            )}

            <section>
                <h2>Datos del endpoint</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </section>
        </div>
    );
}
