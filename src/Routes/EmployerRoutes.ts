import {Router} from "express";
import EmployerAuthRoutes from "./AuthRoutes/EmployerAuthRoutes";
import {GetProfile, UpdateProfile,GetJobById,GetJobs} from "../Controllers/EmployerController";
import {isEmployerProfileComplete, isEmployerVerifiedMiddleware} from "../Middlewares/AuthMiddleware";
const router = Router();
router.use('/auth',EmployerAuthRoutes);
router.get('/profile',isEmployerVerifiedMiddleware,GetProfile)
router.put('/profile',isEmployerVerifiedMiddleware,UpdateProfile)
router.get('/jobs',isEmployerVerifiedMiddleware,isEmployerProfileComplete,GetJobs)
router.get('/job/:id',isEmployerVerifiedMiddleware,isEmployerProfileComplete,GetJobById)


export default router;