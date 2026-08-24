import { Router } from "express";
import { cadastrarUsuario, login } from "../controllers/usuarios_controller";
import { autenticar } from "../middlewares/routes_protect";
const router = Router();
router.post("/", cadastrarUsuario)
router.post("/login", autenticar, login)
// adicionar unique na database de clientes
export default router;