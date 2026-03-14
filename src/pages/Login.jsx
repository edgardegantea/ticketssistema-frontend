// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    function handleChange(e) {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            await login(form); // llama a loginRequest → backend CI4
            navigate('/'); // o '/admin', según tu router
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }}>
            <h1>Iniciar sesión</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="email">Correo</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                {error && (
                    <div style={{ color: 'red', marginBottom: 12 }}>
                        {error}
                    </div>
                )}

                <button type="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    );
}
