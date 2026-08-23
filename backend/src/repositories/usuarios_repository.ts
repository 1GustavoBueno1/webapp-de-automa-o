import { DB } from "../config/database";
import type { Role } from "../types/usuario";

export async function criarUsuairo(
    nome: string,
    email: string,
    senha: string,
    role: Role
) { 
    const resultado = await DB.query(

        `INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4)
        RETURNING *`, [nome, email, senha, role]
    );
    return resultado.rows[0]
};


export async function buscarUsuarioPorEmail(email: string) {
    const resultado = await DB.query(

        `
        SELECT *
        FROM usuarios
        WHERE email = $1
        `,
        [email]
    ) ;

    return resultado.rows[0]
}