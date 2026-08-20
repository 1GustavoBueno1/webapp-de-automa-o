import { Router } from "express";
import { listarClientes, CadastrarCliente, BuscarClientes, EditarClientes} from "../controllers/clientes_controller";

const router = Router();
router.get("/", listarClientes);
router.post("/", CadastrarCliente);
router.get("/:id", BuscarClientes);
router.post("/:id", EditarClientes)


export default router;