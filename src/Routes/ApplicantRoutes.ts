import {Router} from "express";
import {GetApplicantProfile, UpdateApplicantProfile} from "../Controllers/ApplicantController";
import {ApplicantTokenValidateMiddleware, isApplicantVerifiedMiddleware} from "../Middlewares/AuthMiddleware";
import ApplicantAuthRoutes from "./AuthRoutes/ApplicantAuthRoutes";

const router = Router();

router.use('/auth',ApplicantAuthRoutes);
router.get('/profile',ApplicantTokenValidateMiddleware,isApplicantVerifiedMiddleware, GetApplicantProfile);
router.put("/profile",ApplicantTokenValidateMiddleware,isApplicantVerifiedMiddleware, UpdateApplicantProfile);
export default router;