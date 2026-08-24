import app from "./app";
import { verificarConexao } from "./repositories/database_repository";

console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_DB);
verificarConexao()
  .then((resultado) => {
    console.log("Banco conectado:", resultado);
  })
  .catch((erro) => {
    console.error("Erro ao conectar no banco:", erro);
  });

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
