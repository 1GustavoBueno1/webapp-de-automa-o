import { DB } from "../config/database";
import { Role } from "../types/usuario";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { criarUsuairo, buscarUsuarioPorEmail } from "../repositories/usuarios_repository";


export async function cadastrarUsuario(req: Request, res: Response) {
    const {nome, email, senha, role} = req.body;

    if (!nome || !email || !senha || !role) {
        return res.status(400).json({
            message: "Dados estão faltando"
        });
    };

    if (role !== "ADMIN" && role !== "FUNCIONARIO") {
        return res.status(400).json({
            message: "Role inválida"
        });
    };

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await criarUsuairo(
        nome,
        email,
        senhaHash,
        role as Role
    );
    return res.status(201).json({
        message: "Usuario cadastrado",
        usuario
    })

}

export async function login(req: Request, res: Response) {
    const {email, senha} = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({
            message: "Email e senha sáo obrigatorios"
        })
    }

    const usuario = await buscarUsuarioPorEmail(email)

    if (!usuario) {
        return res.status(400).json({
            message: "Email ou senha invalidos"
        })
    }

    const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha
    )

    if (!senhaCorreta) {
        return res.status(400).json({
            message: "Email ou senha invalidos"
        })
    }
    return res.json({
        message: "Login realizado com sucesso"
    })
}