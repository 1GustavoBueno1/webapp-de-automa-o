// Ponto único de configuração da API e de acesso HTTP.
// Nenhum outro arquivo deve conter a URL do backend ou montar headers manualmente.

export const API_BASE_URL = "http://localhost:3000";

const TOKEN_KEY = "sistema_automacao_token";

export function getBasePath() {
    return window.location.pathname.includes("/pages/") ? "../" : "";
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError(
            "Não foi possível conectar à API. Verifique se o backend está rodando em " + API_BASE_URL + ".",
            0,
            null
        );
    }

    if (response.status === 401) {
        clearToken();
        window.location.href = getBasePath() + "index.html";
        throw new ApiError("Sessão expirada. Faça login novamente.", 401, null);
    }

    const text = await response.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const message = (data && data.message) || `Erro na requisição (${response.status})`;
        throw new ApiError(message, response.status, data);
    }

    return data;
}

export const Api = {
    // Autenticação
    login: (email, senha) => request("/usuarios/login", { method: "POST", body: { email, senha }, auth: false }),
    cadastrarUsuario: (payload) => request("/usuarios", { method: "POST", body: payload }),

    // Clientes
    listarClientes: () => request("/clientes"),
    buscarClientesPorResponsavel: (responsavel) =>
        request(`/clientes/buscar?responsavel=${encodeURIComponent(responsavel)}`),
    criarCliente: (payload) => request("/clientes", { method: "POST", body: payload }),
    atualizarCampoCliente: (id, campo, valor) =>
        request(`/clientes/${id}`, { method: "PATCH", body: { [campo]: valor } }),
    excluirCliente: (id) => request(`/clientes/${id}`, { method: "DELETE" }),

    // Automações
    listarAutomacoes: () => request("/automacoes"),
    buscarAutomacao: (id) => request(`/automacoes/${id}`),
    criarAutomacao: (payload) => request("/automacoes", { method: "POST", body: payload }),
    executarAutomacao: (id) => request(`/automacoes/${id}/executar`, { method: "POST" }),
    excluirAutomacao: (id) => request(`/automacoes/${id}`, { method: "DELETE" }),

    // Jobs
    listarJobs: () => request("/job"),
    buscarJob: (id) => request(`/job/${id}`),
    atualizarJob: (id, payload) => request(`/job/${id}`, { method: "PATCH", body: payload }),
    excluirJob: (id) => request(`/job/${id}`, { method: "DELETE" }),
};
