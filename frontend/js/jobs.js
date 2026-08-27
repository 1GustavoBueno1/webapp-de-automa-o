import { Api } from "./api.js";
import { requireAuth } from "./auth.js";
import { renderLayout, escapeHtml, formatDateTime, statusBadge, handleApiError } from "./ui.js";

const user = requireAuth();

if (user) {
    renderLayout("jobs", "Jobs");

    const alertBox = document.getElementById("jobs-alert");
    const tbody = document.getElementById("jobs-tbody");
    const refreshBtn = document.getElementById("refresh-jobs-btn");

    async function loadJobs() {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Carregando...</td></tr>`;
        try {
            // O job só guarda automacao_id; cliente é obtido cruzando automação -> cliente_id -> cliente.
            const [jobs, automacoes, clientes] = await Promise.all([
                Api.listarJobs(),
                Api.listarAutomacoes(),
                Api.listarClientes(),
            ]);

            if (jobs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Nenhum job encontrado.</td></tr>`;
                return;
            }

            tbody.innerHTML = jobs
                .map((job) => {
                    const automacao = automacoes.find((a) => a.id === job.automacao_id);
                    const cliente = automacao ? clientes.find((c) => c.id === automacao.cliente_id) : null;

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
                    </tr>`;
                })
                .join("");
        } catch (error) {
            handleApiError(error, alertBox);
            tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Erro ao carregar jobs.</td></tr>`;
        }
    }

    refreshBtn.addEventListener("click", loadJobs);
    loadJobs();
}
