import { criarAutomacao } from "../repositories/automacoes_repository";
import { IdExistente } from "../repositories/clientes_repository";


export async function CadastrarCliente(
    nome: string,
    tipo: string,
    cliente_id: string
) {
    if (!nome || !tipo || !cliente_id) {
        return {erro: "Dados estão faltando"}
    }
    if (await !IdExistente(cliente_id)) {

    }
    
    const automacao = await criarAutomacao(
        nome,
        tipo,
        Number(cliente_id)
    )
    return automacao
}

