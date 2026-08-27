// Utilidades de interface compartilhadas por todas as páginas internas:
// layout (sidebar/topbar), alertas, formatação e badges de status.

import { getCurrentUser, logout } from "./auth.js";

const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", href: "dashboard.html" },
    { key: "clientes", label: "Clientes", href: "clientes.html" },
    { key: "automacoes", label: "Automações", href: "automacoes.html" },
    { key: "jobs", label: "Jobs", href: "jobs.html" },
    { key: "usuarios", label: "Usuários", href: "usuarios.html", adminOnly: true },
];

export function renderLayout(activeKey, pageTitle) {
    const user = getCurrentUser();

    const titleEl = document.getElementById("page-title");
    const roleEl = document.getElementById("current-role");
    const navEl = document.getElementById("sidebar-nav");
    const logoutBtn = document.getElementById("logout-btn");

    if (titleEl) titleEl.textContent = pageTitle;

    if (roleEl && user) {
        roleEl.textContent = user.role === "ADMIN" ? "Administrador" : "Funcionário";
    }

    if (navEl) {
        navEl.innerHTML = NAV_ITEMS.filter((item) => !item.adminOnly || (user && user.role === "ADMIN"))
            .map(
                (item) =>
                    `<a href="${item.href}" class="nav-link${item.key === activeKey ? " active" : ""}">${item.label}</a>`
            )
            .join("");
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => logout());
    }

    return user;
}

export function showAlert(container, message, type = "error") {
    if (!container) return;
    container.textContent = message;
    container.className = `alert alert-${type}`;
    container.hidden = false;
}

export function clearAlert(container) {
    if (!container) return;
    container.hidden = true;
    container.textContent = "";
    container.className = "alert";
}

// Trata 401 (já resolvido no api.js, que redireciona) e diferencia 403 do restante.
export function handleApiError(error, container) {
    if (error && error.status === 403) {
        showAlert(container, "Você não tem permissão para realizar esta ação.", "warning");
    } else {
        showAlert(container, (error && error.message) || "Ocorreu um erro inesperado.", "error");
    }
}

export function escapeHtml(value) {
    if (value === null || value === undefined || value === "") return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("pt-BR");
}

const STATUS_CLASSES = {
    PENDENTE: "badge-pendente",
    PROCESSANDO: "badge-processando",
    CONCLUIDO: "badge-concluido",
    ERRO: "badge-erro",
};

export function statusBadge(status) {
    const cls = STATUS_CLASSES[status] || "badge-default";
    return `<span class="badge ${cls}">${escapeHtml(status || "DESCONHECIDO")}</span>`;
}
