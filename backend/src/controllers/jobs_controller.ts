import { criarJOB } from "../repositories/jobs_repository";
import { cadastroJOB } from "../services/jobs_service";



import { Response, Request } from "express";
export async function iniciarJOBs(req: Request, res: Response,) {
    const automacaoID = Number(req.params.id);
    const resultado = await cadastroJOB(automacaoID)

    if ("erro" in resultado) {
        return res.status(400).json({
            message: resultado.erro
        })
    }
    return res.status(201).json({
        message: "Automação adicionada para processamento",
        resultado
    })
}