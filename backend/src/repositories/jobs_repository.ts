import { DB } from "../config/database";

export async function criarJOB(automacaoID: number) {
    const resultado = await DB.query(
        `
        INSERT INTO jobs(automacao_id, status)
        VALUES($1, $2)
        RETURNING *
        `, [automacaoID, "PENDENTE"]
    )
    return resultado.rows[0]
}

export async function listarJobs() {
    const resultado = await DB.query(
        `
        SELECT * FROM jobs
        ORDER BY criado_em DESC
        `
    )
    return resultado.rows
}

export async function buscarJobPorId(id: number) {
    const resultado = await DB.query(
        `
        SELECT * FROM jobs WHERE id = $1
        `, [id]
    )
    return resultado.rows[0]
}