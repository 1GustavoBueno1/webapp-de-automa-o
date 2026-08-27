import { Router } from "express";
import { ListarJobs, BuscarJobPorId } from "../controllers/jobs_controller";
import { autenticar } from "../middlewares/routes_protect";

const router = Router();
router.get("/", autenticar, ListarJobs);
router.get("/:id", autenticar, BuscarJobPorId);

export default router;
