// Sessão do usuário: login, leitura do JWT, guarda de rotas e logout.

import { Api, getToken, setToken, clearToken, getBasePath } from "./api.js";

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function getCurrentUser() {
    const token = getToken();
    if (!token) return null;

    const payload = parseJwt(token);
    if (!payload) return null;

    if (payload.exp && Date.now() >= payload.exp * 1000) {
        clearToken();
        return null;
    }

    return { id: payload.id, role: payload.role };
}

export async function login(email, senha) {
    const data = await Api.login(email, senha);
    setToken(data.token);
    return data;
}

export function logout() {
    clearToken();
    window.location.href = getBasePath() + "index.html";
}

// Chame no topo de cada página protegida. Retorna o usuário ou redireciona.
export function requireAuth(allowedRoles) {
    const user = getCurrentUser();
    const basePath = getBasePath();

    if (!user) {
        window.location.href = basePath + "index.html";
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        window.location.href = basePath + "pages/dashboard.html";
        return null;
    }

    return user;
}
