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
    );
    return resultado.rows
};

export async function atualizarCliente(id: number, campo: string, valor: string) {
    const resultado = await DB.query(
        `
        UPDATE clientes
        SET ${campo} = $1
        WHERE id = $2
        RETURNING *
        `, [valor, id]
    );

    return resultado.rows[0]

};

export async function deletarClientes(id: number) {
    const resultado = await DB.query(

        `
        DELETE FROM clientes
        WHERE id = $1
        RETURNING *
        `, [id]
    );

    return resultado.rows[0]
}
