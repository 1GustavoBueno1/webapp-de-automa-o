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