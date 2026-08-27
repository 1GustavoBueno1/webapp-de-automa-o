import { Api } from "./api.js";
import { requireAuth } from "./auth.js";
import { renderLayout, showAlert, clearAlert, escapeHtml, formatDateTime, handleApiError } from "./ui.js";

const user = requireAuth();

if (user) {
    renderLayout("clientes", "Clientes");
    const isAdmin = user.role === "ADMIN";

    let clientesCache = [];
    let editingOriginal = null;

    const alertBox = document.getElementById("clientes-alert");
    const tbody = document.getElementById("clientes-tbody");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-responsavel");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const newClienteBtn = document.getElementById("new-cliente-btn");
    const formSection = document.getElementById("cliente-form-section");
    const formTitle = document.getElementById("cliente-form-title");
    const clienteForm = document.getElementById("cliente-form");
    const cancelBtn = document.getElementById("cancel-cliente-btn");

    if (isAdmin) newClienteBtn.hidden = false;

    function renderClientes(clientes) {
        if (!clientes || clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Nenhum cliente encontrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = clientes
            .map(
                (c) => `
            <tr>
                <td>${escapeHtml(c.nome)}</td>
                <td>${escapeHtml(c.cnpj)}</td>
                <td>${escapeHtml(c.responsavel) || "—"}</td>
                <td>${escapeHtml(c.email) || "—"}</td>
                <td>${formatDateTime(c.criado_em)}</td>
                <td class="actions">
                    ${
                        isAdmin
                            ? `<button class="btn btn-small btn-secondary" data-action="edit" data-id="${c.id}">Editar</button>
                               <button class="btn btn-small btn-danger" data-action="delete" data-id="${c.id}">Excluir</button>`
                            : `<span class="text-muted">—</span>`
                    }
                </td>
            </tr>`
            )
            .join("");
    }

    async function loadClientes() {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Carregando...</td></tr>`;
        try {
            const clientes = await Api.listarClientes();
            clientesCache = clientes;
            renderClientes(clientes);
        } catch (error) {
            handleApiError(error, alertBox);
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Erro ao carregar clientes.</td></tr>`;
        }
    }

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAlert(alertBox);

        const responsavel = searchInput.value.trim();
        if (!responsavel) {
            await loadClientes();
            return;
        }

        try {
            const clientes = await Api.buscarClientesPorResponsavel(responsavel);
            renderClientes(clientes);
        } catch (error) {
            handleApiError(error, alertBox);
        }
    });

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        loadClientes();
    });

    function openForm(cliente) {
        clearAlert(alertBox);
        if (cliente) {
            formTitle.textContent = "Editar Cliente";
            document.getElementById("cliente-id").value = cliente.id;
            document.getElementById("cliente-nome").value = cliente.nome || "";
            document.getElementById("cliente-cnpj").value = cliente.cnpj || "";
            document.getElementById("cliente-responsavel").value = cliente.responsavel || "";
            document.getElementById("cliente-email").value = cliente.email || "";
            editingOriginal = cliente;
        } else {
            formTitle.textContent = "Novo Cliente";
            clienteForm.reset();
            document.getElementById("cliente-id").value = "";
            editingOriginal = null;
        }
        formSection.hidden = false;
    }

    function closeForm() {
        formSection.hidden = true;
        clienteForm.reset();
        editingOriginal = null;
    }

    newClienteBtn.addEventListener("click", () => openForm(null));
    cancelBtn.addEventListener("click", closeForm);

    tbody.addEventListener("click", async (event) => {
        const btn = event.target.closest("button[data-action]");
        if (!btn) return;

        const id = btn.dataset.id;
        const cliente = clientesCache.find((c) => String(c.id) === String(id));

        if (btn.dataset.action === "edit" && cliente) {
            openForm(cliente);
        }

        if (btn.dataset.action === "delete") {
            const nome = cliente ? cliente.nome : `#${id}`;
            if (!confirm(`Excluir o cliente "${nome}"? Essa ação não pode ser desfeita.`)) return;

            try {
                await Api.excluirCliente(id);
                await loadClientes();
            } catch (error) {
                handleApiError(error, alertBox);
            }
        }
    });

    clienteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAlert(alertBox);

        const id = document.getElementById("cliente-id").value;
        const values = {
            nome: document.getElementById("cliente-nome").value.trim(),
            cnpj: document.getElementById("cliente-cnpj").value.trim(),
            responsavel: document.getElementById("cliente-responsavel").value.trim(),
            email: document.getElementById("cliente-email").value.trim(),
        };

        const submitBtn = clienteForm.querySelector("button[type=submit]");
        submitBtn.disabled = true;

        try {
            if (!id) {
                await Api.criarCliente(values);
            } else {
                // O backend só aceita um campo por PATCH: envia apenas os campos alterados, em sequência.
                const changedFields = Object.keys(values).filter(
                    (key) => values[key] !== (editingOriginal ? editingOriginal[key] || "" : "")
                );
                for (const field of changedFields) {
                    await Api.atualizarCampoCliente(id, field, values[field]);
                }
            }
            closeForm();
            await loadClientes();
        } catch (error) {
            handleApiError(error, alertBox);
        } finally {
            submitBtn.disabled = false;
        }
    });

    loadClientes();
}
