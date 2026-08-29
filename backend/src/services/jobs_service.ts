import { criarJOB, listarJobs, buscarJobPorId, atualizarJob, deletarJob } from "../repositories/jobs_repository";
import { IdExistenteAutomacao } from "../repositories/automacoes_repository";

const STATUS_PERMITIDOS = ["PENDENTE", "PROCESSANDO", "CONCLUIDO", "ERRO"];
const CAMPOS_PERMITIDOS_JOB = ["status", "resultado", "erro", "iniciado_em", "finalizado_em"];

export async function cadastroJOB(automacaoID: number) {
    if (!automacaoID) {
        return {erro: "ID da automação inválido"}
    }
    if (!(await IdExistenteAutomacao(automacaoID))) {
         return {erro: "ID da automação não existe"}
    }
    const resultado = await criarJOB(automacaoID)
    return {resultado}
}

export async function listarJobsService() {
    const jobs = await listarJobs();
    return { jobs };
}

export async function buscarJobPorIdService(id: number) {
    if (!id) {
        return { erro: "ID do job inválido" };
    }
    const job = await buscarJobPorId(id);
    if (!job) {
        return { erro: "Job não encontrado" };
    }
    return { job };
}

export async function atualizarJobService(id: number, dados: Record<string, any>) {
    if (!id) {
        return { erro: "ID do job inválido" };
    }

    const campos = Object.keys(dados).filter(
        (campo) => CAMPOS_PERMITIDOS_JOB.includes(campo) && dados[campo] !== undefined
    );

    if (campos.length === 0) {
        return { erro: "Envie ao menos um campo válido para atualizar (status, resultado, erro, iniciado_em, finalizado_em)" };
    }

    if (dados.status !== undefined && !STATUS_PERMITIDOS.includes(dados.status)) {
        return { erro: `Status inválido. Use um de: ${STATUS_PERMITIDOS.join(", ")}` };
    }

    const jobExistente = await buscarJobPorId(id);
    if (!jobExistente) {
        return { erro: "Job não encontrado" };
    }

    const valores: Record<string, any> = {};
    for (const campo of campos) {
        valores[campo] = dados[campo] === "" ? null : dados[campo];
    }

    const job = await atualizarJob(id, valores);
    return { job };
}

export async function excluirJobService(id: number) {
    if (!id) {
        return { erro: "ID do job inválido" };
    }
    const job = await deletarJob(id);
    if (!job) {
        return { erro: "Job não encontrado" };
    }
    return { job };
}