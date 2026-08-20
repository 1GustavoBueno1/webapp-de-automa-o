import { Request, Response } from "express";

export function listarClientes(req: Request, res: Response) {
    res.json({
        message: "lista de clientes",
    });
};

export function CadastrarCliente(req: Request, res: Response) {
    const dados = req.body;
    res.json ({
        message: "Cliente recebido",
        cliente: dados, 

    });
};

export function BuscarClientes(req: Request, res: Response) {
    const id = req.params.id;
    res.json ({
        message: "Cliente encontrado",
        id: `Numero de id ${id}`
    });
};

export function EditarClientes(req: Request, res: Response) {
    const id = req.params.id;
    const dados = req.body
    res.json ({
        id: `Id alterado ${id}`,
        dados: `Dados alterados ${dados}`
    })
}