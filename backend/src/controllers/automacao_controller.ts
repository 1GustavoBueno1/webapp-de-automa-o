import { Request, Response } from "express";
import { CadastrarCliente, listarAutomacoesService, buscarAutomacaoPorIdService, excluirAutomacaoService } from "../services/automacao_service";

export async function cadastrarAutomacao(req: Request, res: Response) {
    const { nome, tipo, cliente_id } = req.body;
    const resultado = await CadastrarCliente( nome, tipo, cliente_id);

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }
    return res.status(201).json(resultado);
}

export async function ListarAutomacoes(req: Request, res: Response) {
    const resultado = await listarAutomacoesService();
    return res.status(200).json(resultado.automacoes);
}

export async function BuscarAutomacaoPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resultado = await buscarAutomacaoPorIdService(id);

    if ("erro" in resultado) {
        return res.status(404).json({ message: resultado.erro });
    }

    return res.status(200).json(resultado.automacao);
}

export async function ExcluirAutomacao(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resultado = await excluirAutomacaoService(id);

    if ("erro" in resultado) {
        return res.status(404).json({ message: resultado.erro });
    }

    return res.status(200).json({ message: "Automação excluída", automacao: resultado.automacao });
}