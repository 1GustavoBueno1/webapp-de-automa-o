import { Api } from "./api.js";
import { requireAuth } from "./auth.js";
import { renderLayout, showAlert, clearAlert, escapeHtml, handleApiError } from "./ui.js";

const user = requireAuth();

if (user) {
    renderLayout("automacoes", "Automações");
    const isAdmin = user.role === "ADMIN";

    let clientesCache = [];
    let automacoesCache = [];

    const alertBox = document.getElementById("automacoes-alert");
    const tbody = document.getElementById("automacoes-tbody");
    const newBtn = document.getElementById("new-automacao-btn");
    const formSection = document.getElementById("automacao-form-section");
    const form = document.getElementById("automacao-form");
    const cancelBtn = document.getElementById("cancel-automacao-btn");
    const clienteSelect = document.getElementById("automacao-cliente");

    if (isAdmin) newBtn.hidden = false;

    function clienteNome(clienteId) {
        const cliente = clientesCache.find((c) => c.id === clienteId);
        return cliente ? cliente.nome : `Cliente #${clienteId}`;
    }

    function renderAutomacoes() {
        if (automacoesCache.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Nenhuma automação cadastrada.</td></tr>`;
            return;
        }

        tbody.innerHTML = automacoesCache
            .map(
                (a) => `
            <tr>
                <td>${escapeHtml(a.nome)}</td>
                <td>${escapeHtml(a.tipo)}</td>
                <td>${escapeHtml(clienteNome(a.cliente_id))}</td>
                <td class="actions">
                    <button class="btn btn-small btn-primary" data-action="executar" data-id="${a.id}">Executar</button>
                </td>
            </tr>`
            )
            .join("");
    }

    async function loadAll() {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Carregando...</td></tr>`;
        try {
            const [automacoes, clientes] = await Promise.all([Api.listarAutomacoes(), Api.listarClientes()]);
            automacoesCache = automacoes;
            clientesCache = clientes;

            if (isAdmin) {
                clienteSelect.innerHTML =
                    `<option value="">Selecione um cliente</option>` +
                    clientes.map((c) => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join("");
            }

            renderAutomacoes();
        } catch (error) {
            handleApiError(error, alertBox);
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Erro ao carregar automações.</td></tr>`;
        }
    }

    newBtn.addEventListener("click", () => {
        clearAlert(alertBox);
        form.reset();
        formSection.hidden = false;
    });

    cancelBtn.addEventListener("click", () => {
        formSection.hidden = true;
        form.reset();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAlert(alertBox);

        const payload = {
            nome: document.getElementById("automacao-nome").value.trim(),
            tipo: document.getElementById("automacao-tipo").value.trim(),
            cliente_id: clienteSelect.value,
        };

        const submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;

        try {
            await Api.criarAutomacao(payload);
            formSection.hidden = true;
            form.reset();
            await loadAll();
        } catch (error) {
            handleApiError(error, alertBox);
        } finally {
            submitBtn.disabled = false;
        }
    });

    tbody.addEventListener("click", async (event) => {
        const btn = event.target.closest("button[data-action=executar]");
        if (!btn) return;

        btn.disabled = true;
        const originalLabel = btn.textContent;
        btn.textContent = "Executando...";

        try {
            const resultado = await Api.executarAutomacao(btn.dataset.id);
            showAlert(alertBox, resultado.message || "Automação adicionada para processamento.", "success");
        } catch (error) {
            handleApiError(error, alertBox);
        } finally {
            btn.disabled = false;
            btn.textContent = originalLabel;
        }
    });

    loadAll();
}
