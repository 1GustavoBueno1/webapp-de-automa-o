import { criarJOB, listarJobs, buscarJobPorId } from "../repositories/jobs_repository";
import { IdExistenteAutomacao } from "../repositories/automacoes_repository";

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