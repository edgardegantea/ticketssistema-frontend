// src/services/httpClient.js
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

async function request(path, options = {}) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        let errorText = `Error ${res.status}`;
        try {
            const data = await res.json();
            errorText = data.message || JSON.stringify(data);
        } catch (e) {
            // ignore
        }
        throw new Error(errorText);
    }

    // si 204 No Content
    if (res.status === 204) return null;

    return res.json();
}

export const httpClient = {
    get(path) {
        return request(path, { method: 'GET' });
    },
    post(path, body) {
        return request(path, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },
    // AGREGA ESTO:
    patch(path, body) {
        return request(path, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    },
    put(path, body) {
        return request(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },
    delete(path) {
        return request(path, { method: 'DELETE' });
    },
};
