import { Request, Response } from "express";
import { criarCliente, buscarClientes } from "../repositories/clientes_repository";

export function listarClientes(req: Request, res: Response) {
    res.json({
        message: "lista de clientes",
    });
};



export async function BuscarClientes(req: Request, res: Response) {
    const {nome} = req.body;
    const cliente = await buscarClientes (nome)
    res.status(201).json({
        message: `Cliente encontrato`,
        cliente
    })

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

    const cliente = await criarCliente (
        nome, cnpj, responsavel, email
    )
    res.status(201).json({
        message: "Cliente cadastrato",
        cliente
    })
}