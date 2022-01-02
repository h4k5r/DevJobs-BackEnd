import {Router} from 'express';
import {
    Login,
    ResetPassword,
    ResetToken,
    SignUp, ValidToken,
    VerifyApplicant
} from "../../Controllers/AuthControllers/ApplicantAuthController";
import {ApplicantTokenValidateMiddleware} from "../../Middlewares/AuthMiddleware";

const router = Router();


//create employer
router.post('/signup', SignUp);

//login employer
router.post('/login', Login);

//reset password
router.post('/reset-password', ResetPassword);

//reset password with dynamic token
router.post('/reset-password/:token', ResetToken);

//verify applicant with dynamic token
router.get('/verify/:token',VerifyApplicant)

router.get('validateToken',ApplicantTokenValidateMiddleware,ValidToken)


export default router;