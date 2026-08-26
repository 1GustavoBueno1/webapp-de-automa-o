import express from "express"
import clientes_rotas from "./routes/clientes_rotas"
import usuarios_rotas from  "./routes/usuarios_rotas"
import automacao_rotas from "./routes/automacao_rotas"
import job_rotas from "./routes/automacao_rotas"
const app = express();

app.use(express.json())

app.use("/clientes", clientes_rotas);
app.use("/usuarios", usuarios_rotas)
app.use("/automacoes", automacao_rotas)
app.use("/job", job_rotas)



export default app; 