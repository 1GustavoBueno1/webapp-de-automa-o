import { Router } from "express";
import { CadastrarCliente, BuscarResposavel, EditarClientes, DeletarCliente} from "../controllers/clientes_controller";
import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";

const router = Router();
router.post("/", autenticar, exigirADM,CadastrarCliente);
router.get("/buscar", autenticar, BuscarResposavel);
router.patch("/:id", autenticar, exigirADM ,EditarClientes)
router.delete("/:id", autenticar, exigirADM, DeletarCliente, )


export default router;