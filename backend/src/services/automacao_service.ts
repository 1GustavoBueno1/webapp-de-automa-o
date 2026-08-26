import { criarAutomacao } from "../repositories/automacoes_repository";



export async function CadastrarCliente(
    nome: string,
    tipo: string,
    cliente_id: string
) {
    if (!nome || !tipo || !cliente_id) {
        return {erro: "Dados estão faltando"}
    }
    const automacao = await criarAutomacao(
        nome,
        tipo,
        Number(cliente_id)
    )
    return automacao
}