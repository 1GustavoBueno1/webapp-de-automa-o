import { Request, Response } from "express";
import { criarCliente, buscarResposavel } from "../repositories/clientes_repository";

export function listarClientes(req: Request, res: Response) {
    res.json({
        message: "lista de clientes",
    });
};



export async function BuscarResposavel(req: Request, res: Response) {
    const responsavel = String(req.query.responsavel ?? "");
    if (!responsavel) {
        return res.status(400).json({
            message: "Informe o responsavel"
        });
    };
    const empresas = await buscarResposavel(responsavel);

    return res.json(empresas);
};

export function EditarClientes(req: Request, res: Response) {
    const id = req.params.id;
    const dados = req.body
    res.json ({
        id: `Id alterado ${id}`,
        dados: `Dados alterados ${dados}`
    })
}

export async function CadastrarCliente(req: Request, res: Response) {
    const { nome, cnpj, responsavel, email} = req.body;

    if (!nome || !cnpj) {
        return res.status(400).json({
            message: "Esta faltando dados"
        })
    }
    const cliente = await criarCliente (
        nome, cnpj, responsavel, email
    )
    res.status(201).json({
        message: "Cliente cadastrato",
        cliente
    })
}