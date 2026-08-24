import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { buscarUsuarioPorEmail, criarUsuairo } from "../repositories/usuarios_repository";
import type { Role } from "../types/usuario";
import "dotenv/config"

export async function cadastrarUsuario(
    nome: string,
    email: string,
    senha: string,
    role: Role
) {
    if (!nome || !email || !senha || !role) {
        return { erro: "Dados estão faltando" };
    }

    if (role !== "ADMIN" && role !== "FUNCIONARIO") {
        return { erro: "Role inválida" };
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await criarUsuairo(nome, email, senhaHash, role);

    return { usuario };
}

export async function autenticarUsuario(email: string, senha: string) {
    if (!email || !senha) {
        return { erro: "Email e senha sáo obrigatorios" };
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
        return { erro: "Email ou senha invalidos" };
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
        return { erro: "Email ou senha invalidos" };
    }
    const token = jwt.sign({
        id: usuario.id,
        role: usuario.Role
    }, 
    process.env.JWT_SECRET as string, {

        expiresIn: "1h"
    }    
)
    return {token}
}
