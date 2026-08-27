import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(err);

    if (err?.code === "23505") {
        return res.status(400).json({ message: "Registro já existe (dado duplicado)" });
    }

    if (err?.code === "23503") {
        return res.status(400).json({ message: "Referência inválida: registro relacionado não existe" });
    }

    if (err?.type === "entity.parse.failed") {
        return res.status(400).json({ message: "JSON inválido no corpo da requisição" });
    }

    return res.status(500).json({ message: "Erro interno no servidor" });
}
