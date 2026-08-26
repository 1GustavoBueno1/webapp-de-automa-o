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