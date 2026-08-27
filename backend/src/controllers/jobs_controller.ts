import { cadastroJOB, listarJobsService, buscarJobPorIdService } from "../services/jobs_service";

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

export async function ListarJobs(req: Request, res: Response) {
    const resultado = await listarJobsService();
    return res.status(200).json(resultado.jobs);
}

export async function BuscarJobPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resultado = await buscarJobPorIdService(id);

    if ("erro" in resultado) {
        return res.status(404).json({ message: resultado.erro });
    }

    return res.status(200).json(resultado.job);
}