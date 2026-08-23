import { Router } from "express";
import { cadastrarUsuario, login } from "../controllers/usuarios_controller";
const router = Router();
router.post("/", cadastrarUsuario)
router.post("/login", login)
// adicionar unique na database de clientes
export default router;