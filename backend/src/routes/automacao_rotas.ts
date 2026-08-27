import { Router } from "express";
import { cadastrarAutomacao } from "../controllers/automacao_controller";
import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";
import { iniciarJOBs } from "../controllers/jobs_controller";


const router = Router();
router.post("/", autenticar, exigirADM, cadastrarAutomacao)
router.post("/:id/executar", autenticar, iniciarJOBs)
export default router;