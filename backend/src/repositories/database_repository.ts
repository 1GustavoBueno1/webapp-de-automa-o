import { DB } from "../config/database";

export async function verificarConexao() {
    const resultado = await DB.query("SELECT NOW()");
    return resultado.rows[0];
}
