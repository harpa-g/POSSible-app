export async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json(); // { token, role, username }
}

export function saveAuth(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getRole() {
    return localStorage.getItem('role');
}

export function getUsername() {
    return localStorage.getItem('username');
}

export function isLoggedIn() {
    return !!localStorage.getItem('token');
}

export function isAdmin() {
    return localStorage.getItem('role') === 'ROLE_ADMIN';
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
}

export function authHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
