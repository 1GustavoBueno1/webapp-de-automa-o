import express from "express"
import clientes_rotas from "./routes/clientes_rotas"


const app = express();

app.use(express.json())

app.use("/clientes", clientes_rotas);




export default app; 