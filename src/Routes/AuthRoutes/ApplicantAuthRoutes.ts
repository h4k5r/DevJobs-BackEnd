import {Router} from 'express';
import {
    Login,
    ResetPassword,
    ResetToken,
    SignUp,
    VerifyApplicant
} from "../../Controllers/AuthControllers/ApplicantAuthController";

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


export default router;