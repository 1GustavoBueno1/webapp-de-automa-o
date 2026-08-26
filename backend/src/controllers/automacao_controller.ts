import { Request, Response } from "express";
import { CadastrarCliente } from "../services/automacao_service";

export async function cadastrarAutomacao(req: Request, res: Response) {
    const { nome, tipo, cliente_id } = req.body;
    const resultado = await CadastrarCliente( nome, tipo, cliente_id);
    
    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }
    return res.status(201).json(resultado);
}