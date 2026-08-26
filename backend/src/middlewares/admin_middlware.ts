import { Request, Response, NextFunction } from "express";

export function exigirADM(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.usuario) {
        return res.status(401).json({
            message: "Usuario não autenticado"
        })
    }
    console.log("ROLE RECEBIDA:", req.usuario.role);
    if (req.usuario.role !== "ADMIN") {
        return res.status(403).json({
            
            message: "Acesso negado"
        })
    }
    next()
}