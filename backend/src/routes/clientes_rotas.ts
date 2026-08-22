import { Router } from "express";
import { listarClientes, CadastrarCliente, BuscarResposavel, EditarClientes} from "../controllers/clientes_controller";

const router = Router();
router.get("/", listarClientes);
router.post("/", CadastrarCliente);
router.get("/buscar", BuscarResposavel);
router.post("/:id", EditarClientes)


export default router;