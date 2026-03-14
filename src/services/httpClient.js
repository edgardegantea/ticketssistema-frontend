// src/services/httpClient.js
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

async function request(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...getAuthHeaders(),
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const err = new Error(data?.message || data?.error || 'Error en la petición');
        err.status = response.status;
        throw err;
    }

    return data;
}

export const httpClient = {
    get: (path) => request(path, { method: 'GET' }),
    post: (path, body) =>
        request(path, { method: 'POST', body: JSON.stringify(body) }),
};
