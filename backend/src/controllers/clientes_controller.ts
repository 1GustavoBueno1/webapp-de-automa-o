import { Request, Response } from "express";
import {
    buscarClientesPorResponsavel,
    cadastrarCliente,
    deletarCliente,
    editarCliente
} from "../services/clientes_service";

export async function DeletarCliente(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resultado = await deletarCliente(id);

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }

    return res.status(200).json({
        message: "Cliente deletado com sucesso",
        cliente: resultado.cliente
    });
}

export async function BuscarResposavel(req: Request, res: Response) {
    const responsavel = String(req.query.responsavel ?? "");
    const resultado = await buscarClientesPorResponsavel(responsavel);

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }

    return res.json(resultado.empresas);
}

export async function CadastrarCliente(req: Request, res: Response) {
    const { nome, cnpj, responsavel, email } = req.body;
    const resultado = await cadastrarCliente(nome, cnpj, responsavel, email);

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }

    return res.status(201).json({
        message: "Cliente cadastrato",
        cliente: resultado.cliente
    });
}

export async function EditarClientes(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resultado = await editarCliente(id, req.body);

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }

    return res.status(201).json({
        message: "Dados atualizados",
        cliente: resultado.cliente
    });
}
