import { Router } from "express";
import { cadastrarAutomacao } from "../controllers/automacao_controller";
const router = Router();
router.post("/", cadastrarAutomacao)
export default router;