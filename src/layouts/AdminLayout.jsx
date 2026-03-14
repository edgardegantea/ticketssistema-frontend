// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
            <aside
                style={{
                    width: 240,
                    background: '#1f2933',
                    color: '#fff',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>Soporte Admin</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.8 }}>
                        {user?.email}
                    </p>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li>
                            <NavLink
                                to="/admin"
                                style={({ isActive }) => ({
                                    display: 'block',
                                    padding: '8px 10px',
                                    borderRadius: 4,
                                    color: '#e5e7eb',
                                    textDecoration: 'none',
                                    backgroundColor: isActive ? '#374151' : 'transparent',
                                    fontSize: 14,
                                })}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/tickets"
                                style={({ isActive }) => ({
                                    display: 'block',
                                    padding: '8px 10px',
                                    borderRadius: 4,
                                    color: '#e5e7eb',
                                    textDecoration: 'none',
                                    backgroundColor: isActive ? '#374151' : 'transparent',
                                    fontSize: 14,
                                })}
                            >
                                Tickets
                            </NavLink>
                        </li>
                    </ul>
                </nav>


                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 16,
                        padding: '8px 10px',
                        width: '100%',
                        borderRadius: 4,
                        border: 'none',
                        background: '#ef4444',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 14,
                    }}
                >
                    Cerrar sesión
                </button>
            </aside>

            <main
                style={{
                    flex: 1,
                    padding: 24,
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}
