import { Router } from "express";
import { ListarJobs, BuscarJobPorId, AtualizarJob, ExcluirJob } from "../controllers/jobs_controller";
import { autenticar } from "../middlewares/routes_protect";
import { exigirADM } from "../middlewares/admin_middlware";

const router = Router();
router.get("/", autenticar, ListarJobs);
router.get("/:id", autenticar, BuscarJobPorId);
router.patch("/:id", autenticar, AtualizarJob);
router.delete("/:id", autenticar, exigirADM, ExcluirJob);

export default router;
