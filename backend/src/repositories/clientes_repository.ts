import {DB} from "../config/database";

export async function criarCliente(
    nome: string,
    cnpj: string,
    responsavel: string,
    email: string
) {
    const resultado = await DB.query(
        `
        INSERT INTO clientes (nome, cnpj, responsavel, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [nome, cnpj, responsavel, email]
    )
    return resultado.rows[0]
}

export async function buscarResposavel(responsavel: string) {
    const resultado = await  DB.query(
        `
        SELECT * FROM clientes WHERE responsavel = $1
        `,
        [responsavel]
    )
    return resultado.rows
}