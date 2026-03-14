const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export async function loginRequest(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data?.message || 'Credenciales inválidas';
        throw new Error(message);
    }

    // Esperamos { access_token, token_type, user }
    return data;
}