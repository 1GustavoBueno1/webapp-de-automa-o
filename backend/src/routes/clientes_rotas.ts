import { Router } from "express";
import { listarClientes, CadastrarCliente, BuscarResposavel, EditarClientes} from "../controllers/clientes_controller";
import { buscarResposavel } from "../repositories/clientes_repository";

const router = Router();
router.get("/", listarClientes);
router.post("/", CadastrarCliente);
router.get("/buscar", buscarResposavel);
router.post("/:nome", EditarClientes)


export default router;