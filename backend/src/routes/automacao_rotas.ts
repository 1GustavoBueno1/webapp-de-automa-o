import { Router } from "express";
import { cadastrarAutomacao, ListarAutomacoes, BuscarAutomacaoPorId, ExcluirAutomacao } from "../controllers/automacao_controller";
import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";
import { iniciarJOBs } from "../controllers/jobs_controller";


const router = Router();
router.get("/", autenticar, ListarAutomacoes)
router.get("/:id", autenticar, BuscarAutomacaoPorId)
router.post("/", autenticar, exigirADM, cadastrarAutomacao)
router.post("/:id/executar", autenticar, iniciarJOBs)
router.delete("/:id", autenticar, exigirADM, ExcluirAutomacao)
export default router;