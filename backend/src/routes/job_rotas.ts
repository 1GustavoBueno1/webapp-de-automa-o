import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";
import { Router } from "express";
import { iniciarJOBs } from "../controllers/jobs_controller";


const router = Router();
router.post("/:id/executar", autenticar, iniciarJOBs)