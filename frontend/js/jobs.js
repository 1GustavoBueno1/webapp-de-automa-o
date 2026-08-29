import { Api } from "./api.js";
import { requireAuth } from "./auth.js";
import { renderLayout, showAlert, clearAlert, escapeHtml, formatDateTime, statusBadge, handleApiError } from "./ui.js";

const user = requireAuth();

if (user) {
    renderLayout("jobs", "Jobs");
    const isAdmin = user.role === "ADMIN";

    let jobsCache = [];
    let automacoesCache = [];
    let clientesCache = [];

    const alertBox = document.getElementById("jobs-alert");
    const tbody = document.getElementById("jobs-tbody");
    const refreshBtn = document.getElementById("refresh-jobs-btn");
    const formSection = document.getElementById("job-form-section");
    const form = document.getElementById("job-form");
    const cancelBtn = document.getElementById("cancel-job-btn");

    // O <input type="datetime-local"> usa "YYYY-MM-DDTHH:mm" (sem timezone/segundos).
    function toDatetimeLocalValue(isoString) {
        if (!isoString) return "";
        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) return "";
        const pad = (n) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function renderJobs() {
        if (jobsCache.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Nenhum job encontrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = jobsCache
            .map((job) => {
                const automacao = automacoesCache.find((a) => a.id === job.automacao_id);
                const cliente = automacao ? clientesCache.find((c) => c.id === automacao.cliente_id) : null;

                return `
                <tr>
                    <td>${statusBadge(job.status)}</td>
                    <td>${escapeHtml(automacao ? automacao.nome : `Automação #${job.automacao_id}`)}</td>
                    <td>${escapeHtml(cliente ? cliente.nome : "—")}</td>
                    <td>${formatDateTime(job.criado_em)}</td>
                    <td>${formatDateTime(job.iniciado_em)}</td>
                    <td>${formatDateTime(job.finalizado_em)}</td>
                    <td>${escapeHtml(job.resultado) || "—"}</td>
                    <td>${escapeHtml(job.erro) || "—"}</td>
                    <td class="actions">
                        <button class="btn btn-small btn-secondary" data-action="editar" data-id="${job.id}">Editar</button>
                        ${
                            isAdmin
                                ? `<button class="btn btn-small btn-danger" data-action="excluir" data-id="${job.id}">Excluir</button>`
                                : ""
                        }
                    </td>
                </tr>`;
            })
            .join("");
    }

    async function loadJobs() {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Carregando...</td></tr>`;
        try {
            // O job só guarda automacao_id; cliente é obtido cruzando automação -> cliente_id -> cliente.
            const [jobs, automacoes, clientes] = await Promise.all([
                Api.listarJobs(),
                Api.listarAutomacoes(),
                Api.listarClientes(),
            ]);
            jobsCache = jobs;
            automacoesCache = automacoes;
            clientesCache = clientes;
            renderJobs();
        } catch (error) {
            handleApiError(error, alertBox);
            tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Erro ao carregar jobs.</td></tr>`;
        }
    }

    function openForm(job) {
        clearAlert(alertBox);
        document.getElementById("job-id").value = job.id;
        document.getElementById("job-status").value = job.status || "PENDENTE";
        document.getElementById("job-iniciado-em").value = toDatetimeLocalValue(job.iniciado_em);
        document.getElementById("job-finalizado-em").value = toDatetimeLocalValue(job.finalizado_em);
        document.getElementById("job-resultado").value = job.resultado || "";
        document.getElementById("job-erro").value = job.erro || "";
        formSection.hidden = false;
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeForm() {
        formSection.hidden = true;
        form.reset();
    }

    cancelBtn.addEventListener("click", closeForm);
    refreshBtn.addEventListener("click", loadJobs);

    tbody.addEventListener("click", async (event) => {
        const btn = event.target.closest("button[data-action]");
        if (!btn) return;

        const job = jobsCache.find((j) => String(j.id) === String(btn.dataset.id));
        if (!job) return;

        if (btn.dataset.action === "editar") {
            openForm(job);
        }

        if (btn.dataset.action === "excluir") {
            if (!confirm(`Excluir o job #${job.id}? Essa ação não pode ser desfeita.`)) return;
            try {
                await Api.excluirJob(job.id);
                await loadJobs();
            } catch (error) {
                handleApiError(error, alertBox);
            }
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAlert(alertBox);

        const id = document.getElementById("job-id").value;
        const iniciadoEm = document.getElementById("job-iniciado-em").value;
        const finalizadoEm = document.getElementById("job-finalizado-em").value;

        const payload = {
            status: document.getElementById("job-status").value,
            iniciado_em: iniciadoEm || null,
            finalizado_em: finalizadoEm || null,
            resultado: document.getElementById("job-resultado").value.trim(),
            erro: document.getElementById("job-erro").value.trim(),
        };

        const submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;

        try {
            await Api.atualizarJob(id, payload);
            closeForm();
            await loadJobs();
        } catch (error) {
            handleApiError(error, alertBox);
        } finally {
            submitBtn.disabled = false;
        }
    });

    loadJobs();
}
