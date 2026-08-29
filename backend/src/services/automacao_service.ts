import { criarAutomacao, listarAutomacoes, buscarAutomacaoPorId, deletarAutomacao } from "../repositories/automacoes_repository";
import { IdExistente } from "../repositories/clientes_repository";


export async function CadastrarCliente(
    nome: string,
    tipo: string,
    cliente_id: string
) {
    if (!nome || !tipo || !cliente_id) {
        return {erro: "Dados estão faltando"}
    }
    if (!(await IdExistente(cliente_id))) {
        return {erro: "Id de cliente não existe"}
    }
    
    const automacao = await criarAutomacao(
        nome,
        tipo,
        Number(cliente_id)
    )
    return automacao
}

export async function listarAutomacoesService() {
    const automacoes = await listarAutomacoes();
    return { automacoes };
}

export async function buscarAutomacaoPorIdService(id: number) {
    if (!id) {
        return { erro: "ID da automação inválido" };
    }
    const automacao = await buscarAutomacaoPorId(id);
    if (!automacao) {
        return { erro: "Automação não encontrada" };
    }
    return { automacao };
}

export async function excluirAutomacaoService(id: number) {
    if (!id) {
        return { erro: "ID da automação inválido" };
    }
    const automacao = await deletarAutomacao(id);
    if (!automacao) {
        return { erro: "Automação não encontrada" };
    }
    return { automacao };
}

