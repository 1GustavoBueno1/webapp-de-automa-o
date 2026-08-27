import { criarJOB } from "../repositories/jobs_repository";
import { IdExistenteAutomacao } from "../repositories/automacoes_repository";

export async function cadastroJOB(automacaoID: number) {
    if (!automacaoID) {
        return {erro: "ID da automação inválido"}
    }
    if (await !IdExistenteAutomacao(automacaoID)) {
         return {erro: "ID da automação não existe"}
    }
    const resultado = await criarJOB(automacaoID)
    return {resultado}
}