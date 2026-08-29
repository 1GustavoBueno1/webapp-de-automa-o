import { DB } from "../config/database";

export async function criarAutomacao(
    nome: string,
    tipo: string,
    cliente_id: number
) {
    const resultado = await DB.query(
        
        `
        INSERT INTO automacao (nome, tipo, cliente_id)
        VALUES($1, $2, $3)
        RETURNING *
        `, [nome, tipo, cliente_id]
    );
    return resultado.rows[0]
    
}

export async function IdExistenteAutomacao(id: number) {
    const resultado = await DB.query (
        `
        SELECT (id, nome, tipo, cliente_id)
        FROM automacao
        WHERE id = $1
        `, [id]
    )
    return resultado.rows[0]
}

export async function listarAutomacoes() {
    const resultado = await DB.query(
        `
        SELECT * FROM automacao
        `
    )
    return resultado.rows
}

export async function buscarAutomacaoPorId(id: number) {
    const resultado = await DB.query(
        `
        SELECT * FROM automacao WHERE id = $1
        `, [id]
    )
    return resultado.rows[0]
}

export async function deletarAutomacao(id: number) {
    const resultado = await DB.query(
        `
        DELETE FROM automacao WHERE id = $1
        RETURNING *
        `, [id]
    )
    return resultado.rows[0]
}