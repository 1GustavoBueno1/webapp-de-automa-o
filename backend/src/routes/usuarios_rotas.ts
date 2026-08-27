import { Router } from "express";
import { cadastrarUsuario, login } from "../controllers/usuarios_controller";
import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";
const router = Router();
router.post("/", autenticar, exigirADM ,cadastrarUsuario)
router.post("/login", login)
// adicionar unique na database de clientes
export default router;