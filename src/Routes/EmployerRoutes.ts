import {Router} from "express";
import EmployerAuthRoutes from "./AuthRoutes/EmployerAuthRoutes";
import {GetProfile, UpdateProfile} from "../Controllers/EmployerController";
import {isEmployerVerifiedMiddleware} from "../Middlewares/AuthMiddleware";
const router = Router();
router.use('/auth',EmployerAuthRoutes);
router.get('/profile',isEmployerVerifiedMiddleware,GetProfile)
router.put('/profile',isEmployerVerifiedMiddleware,UpdateProfile)


export default router;