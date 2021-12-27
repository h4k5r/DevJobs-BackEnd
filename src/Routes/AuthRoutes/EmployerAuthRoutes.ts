import {Router} from "express";
import {
    SignUp,
    Login,
    ResetPassword,
    ResetToken,
    ValidateToken
} from '../../Controllers/AuthControllers/EmployerAuthController';

const router = Router();

//create employer
router.post('/signup',SignUp);

//login employer
router.post('/login',Login);

//reset password
router.post('/reset-password',ResetPassword);

//reset password with dynamic token
router.post('/reset-password/:token',ResetToken);


export default router;