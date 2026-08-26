import { Router } from "express";
import { cadastrarAutomacao } from "../controllers/automacao_controller";
import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";
const router = Router();
router.post("/", autenticar, exigirADM, cadastrarAutomacao)
export default router;