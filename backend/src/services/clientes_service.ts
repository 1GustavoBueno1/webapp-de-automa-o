import {
    atualizarCliente,
    buscarResposavel,
    criarCliente,
    deletarClientes,
    CnpjExistente
} from "../repositories/clientes_repository";

const camposPermitidos = ["nome", "cnpj", "responsavel", "email"];

export async function cadastrarCliente(
    nome: string,
    cnpj: string,
    responsavel: string,
    email: string
) {
    if (!nome || !cnpj) {
        return { erro: "Esta faltando dados" };
    }
    if (await CnpjExistente(cnpj)) {
        return { erro: "CNPJ já cadastrado" };
    }

    const cliente = await criarCliente(nome, cnpj, responsavel, email);
    return { cliente };
}

export async function buscarClientesPorResponsavel(responsavel: string) {
    if (!responsavel) {
        return { erro: "Informe o responsavel" };
    }

    const empresas = await buscarResposavel(responsavel);
    return { empresas };
}

export async function editarCliente(
    id: number,
    dados: Record<string, string>
) {
    const campos = Object.keys(dados);
    const campo = campos[0];

    if (!campo) {
        return { erro: "Envie um campo para atualizar" };
    }

    if (!camposPermitidos.includes(campo)) {
        return { erro: "Campo invalido!" };
    }

    if (campos.length !== 1) {
        return { erro: "Envie apenas um campo para atualizar" };
    }
    if (campo === "cnpj") {
        if (await CnpjExistente(dados[campo]!)) {
            return { erro: "CNPJ já cadastrado" };
    }
    }

    const cliente = await atualizarCliente(id, campo, dados[campo]!);
    return { cliente };
}

export async function deletarCliente(id: number) {
    if (!id) {
        return { erro: "Informe quem voce quer deletar" };
    }

    const cliente = await deletarClientes(id);
    return { cliente };
}
