import { Request, Response } from "express";
import {
    autenticarUsuario,
    cadastrarUsuario as cadastrarUsuarioService
} from "../services/usuarios_service";
import type { role } from "../types/usuario";

export async function cadastrarUsuario(req: Request, res: Response) {
    const { nome, email, senha, role } = req.body;
    const resultado = await cadastrarUsuarioService(
        nome,
        email,
        senha,
        role as role
    );

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }

    return res.status(201).json({
        message: "Usuario cadastrado"
    });
}

export async function login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const resultado = await autenticarUsuario(email, senha);

    if ("erro" in resultado) {
        return res.status(400).json({ message: resultado.erro });
    }

    return res.json({
        message: "Login realizado com sucesso",
        token: resultado.token
    });
}
