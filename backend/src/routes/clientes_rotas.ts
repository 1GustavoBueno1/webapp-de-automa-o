import { Router } from "express";
import { CadastrarCliente, BuscarResposavel, EditarClientes, DeletarCliente} from "../controllers/clientes_controller";

const router = Router();
router.post("/", CadastrarCliente);
router.get("/buscar", BuscarResposavel);
router.post("/:id", EditarClientes)
router.delete("/:id", DeletarCliente)


export default router;