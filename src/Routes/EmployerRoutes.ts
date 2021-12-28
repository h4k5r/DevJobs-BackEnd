import {Router} from "express";
import EmployerAuthRoutes from "./AuthRoutes/EmployerAuthRoutes";
const router = Router();
router.use('/auth',EmployerAuthRoutes);

export default router;