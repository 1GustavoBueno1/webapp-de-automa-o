import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"
import type { TokenPayLoad } from "../types/auth";



export function autenticar(req: Request, res: Response, next: NextFunction) {

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
        message: "Token nao informado"
        });
    }
    const [tipo, token] = authorization.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Formato do token invalido"
        })
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as TokenPayLoad;
    req.usuario = {
        id: payload.id,
        role: payload.role
    }
    console.log(payload);
    next();
    } catch{
        return res.status(401).json({
            message: "token invalido"
        });
    }

}