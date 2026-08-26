import { criarJOB } from "../repositories/jobs_repository";

export async function cadastroJOB(automacaoID: number) {
    if (!automacaoID) {
        return {erro: "ID da automação inválido"}
    }
    const resultado = await criarJOB(automacaoID)
    return {resultado}
}