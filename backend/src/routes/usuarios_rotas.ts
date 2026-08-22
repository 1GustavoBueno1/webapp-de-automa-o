import { Router } from "express";
import { cadastrarUsuario } from "../controllers/usuarios_controller";
const router = Router();
router.post("/", cadastrarUsuario)

export default router;