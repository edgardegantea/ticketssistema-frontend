import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../services/httpClient.js';

export default function TicketCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        estado: 'abierto',
        prioridad: 'media',
    });
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            await httpClient.post('/admin/tickets', form);
            navigate('/admin/tickets');
        } catch (err) {
            setError(err.message || 'Error al crear el ticket');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <h1>Crear ticket</h1>
            <p>Registra un nuevo ticket de soporte.</p>

            {error && (
                <div style={{ color: 'red', marginBottom: 12 }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Título
                        <input
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Descripción
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={4}
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
                    <label>
                        Estado
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                        >
                            <option value="abierto">Abierto</option>
                            <option value="en progreso">En progreso</option>
                            <option value="cerrado">Cerrado</option>
                        </select>
                    </label>

                    <label>
                        Prioridad
                        <select
                            name="prioridad"
                            value={form.prioridad}
                            onChange={handleChange}
                        >
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>
                    </label>
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? 'Guardando...' : 'Crear ticket'}
                </button>
            </form>
        </div>
    );
}
