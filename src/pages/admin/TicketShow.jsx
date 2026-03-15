import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {httpClient} from '../../services/httpClient.js';
import {getEstadoBadgeStyle, getPrioridadBadgeStyle} from '../../styles/badges.js';


export default function TicketShow() {
    const {id} = useParams();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingTicket, setLoadingTicket] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState(null);
    const [commentError, setCommentError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [savingComment, setSavingComment] = useState(false);

    useEffect(() => {
        fetchTicket();
        fetchComments();
    }, [id]);

    async function fetchTicket() {
        try {
            setLoadingTicket(true);
            setError(null);
            const res = await httpClient.get(`/admin/tickets/${id}`);
            setTicket(res);
        } catch (err) {
            setError(err.message || 'Error cargando ticket');
        } finally {
            setLoadingTicket(false);
        }
    }

    async function fetchComments() {
        try {
            setLoadingComments(true);
            setCommentError(null);
            const res = await httpClient.get(`/admin/tickets/${id}/comments`);
            setComments(res.comments || []);
        } catch (err) {
            setCommentError(err.message || 'Error cargando comentarios');
        } finally {
            setLoadingComments(false);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSavingComment(true);
            setCommentError(null);

            await httpClient.post(`/admin/tickets/${id}/comments`, {
                comentario: newComment.trim(),
            });

            setNewComment('');
            fetchComments();
        } catch (err) {
            setCommentError(err.message || 'Error guardando comentario');
        } finally {
            setSavingComment(false);
        }
    }

    if (loadingTicket) return <div>Cargando ticket...</div>;

    if (!ticket) {
        return (
            <div>
                <h1>Ticket no encontrado</h1>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <h1>Ticket #{ticket.id}</h1>
            <p style={{marginBottom: 16}}>{ticket.titulo}</p>

            <section style={{marginBottom: 24}}>
                <h2>Detalles</h2>
                <p style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span><strong>Estado:</strong></span>
                    <span style={getEstadoBadgeStyle(ticket.estado)}>
    {ticket.estado === 'en_progreso' ? 'En progreso' : ticket.estado.charAt(0).toUpperCase() + ticket.estado.slice(1)}
  </span>
                </p>

                <p style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span><strong>Prioridad:</strong></span>
                    <span style={getPrioridadBadgeStyle(ticket.prioridad)}>
    {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
  </span>
                </p>

                <p><strong>Creado por:</strong> {ticket.creado_por}</p>
                <p><strong>Descripción:</strong></p>
                <p>{ticket.descripcion || 'Sin descripción'}</p>
            </section>

            <section style={{marginBottom: 24}}>
                <h2>Comentarios</h2>

                {commentError && (
                    <div style={{color: 'red', marginBottom: 8}}>
                        {commentError}
                    </div>
                )}

                {loadingComments ? (
                    <div>Cargando comentarios...</div>
                ) : (
                    <div style={{marginBottom: 16}}>
                        {comments.length === 0 && <p>No hay comentarios aún.</p>}
                        {comments.map((c) => (
                            <div
                                key={c.id}
                                style={{
                                    padding: 8,
                                    marginBottom: 8,
                                    borderRadius: 4,
                                    background: '#f3f4f6',
                                }}
                            >
                                <div style={{fontSize: 12, color: '#6b7280'}}>
                                    {c.autor} — {c.created_at}
                                </div>
                                <div>{c.comentario}</div>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleAddComment} style={{maxWidth: 600}}>
                    <div style={{marginBottom: 8}}>
                        <label>
                            Nuevo comentario
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                style={{width: '100%'}}
                            />
                        </label>
                    </div>
                    <button type="submit" disabled={savingComment}>
                        {savingComment ? 'Guardando...' : 'Agregar comentario'}
                    </button>
                </form>
            </section>
        </div>
    );
}
