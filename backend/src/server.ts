import app from "./app";
import { DB } from "./config/database";

console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_DB);
DB.query("SELECT NOW()")
  .then((resultado) => {
    console.log("Banco conectado:", resultado.rows[0]);
  })
  .catch((erro) => {
    console.error("Erro ao conectar no banco:", erro);
  });

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});