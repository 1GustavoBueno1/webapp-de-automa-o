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

const COLUNAS_PERMITIDAS_JOB = ["status", "resultado", "erro", "iniciado_em", "finalizado_em"];

export async function atualizarJob(id: number, dados: Record<string, any>) {
    const colunas = Object.keys(dados).filter((coluna) => COLUNAS_PERMITIDAS_JOB.includes(coluna));
    const setClause = colunas.map((coluna, index) => `${coluna} = $${index + 1}`).join(", ");
    const valores = colunas.map((coluna) => dados[coluna]);

    const resultado = await DB.query(
        `
        UPDATE jobs
        SET ${setClause}
        WHERE id = $${colunas.length + 1}
        RETURNING *
        `,
        [...valores, id]
    );
    return resultado.rows[0];
}

export async function deletarJob(id: number) {
    const resultado = await DB.query(
        `
        DELETE FROM jobs WHERE id = $1
        RETURNING *
        `, [id]
    )
    return resultado.rows[0]
}