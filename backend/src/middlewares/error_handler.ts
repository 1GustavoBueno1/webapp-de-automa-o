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
        const bloqueadoPorDependentes = typeof err.detail === "string" && err.detail.includes("is still referenced from");
        const message = bloqueadoPorDependentes
            ? "Não é possível excluir: existem registros vinculados a este item."
            : "Referência inválida: registro relacionado não existe";
        return res.status(400).json({ message });
    }

    if (err?.type === "entity.parse.failed") {
        return res.status(400).json({ message: "JSON inválido no corpo da requisição" });
    }

    return res.status(500).json({ message: "Erro interno no servidor" });
}
