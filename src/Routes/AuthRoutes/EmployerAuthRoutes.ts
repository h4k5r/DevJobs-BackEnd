import {Router} from "express";
import {
    CompletedProfile,
    Login,
    ResetPassword,
    ResetToken,
    SignUp,
    ValidToken, VerifiedProfile,
    VerifyEmployer,
} from '../../Controllers/AuthControllers/EmployerAuthController';
import {
    EmployerTokenValidateMiddleware,
    isEmployerProfileComplete,
    isEmployerVerifiedMiddleware
} from "../../Middlewares/AuthMiddleware";

const router = Router();

//create employer
router.post('/signup', SignUp);

//login employer
router.post('/login', Login);

//reset password
router.post('/reset-password', ResetPassword);

//reset password with dynamic token
router.post('/reset-password/:token', ResetToken);

//verify with dynamic token
router.post('/verify/:token', VerifyEmployer);

//validate token
router.get('/validateToken',EmployerTokenValidateMiddleware,ValidToken);

//verify profile
router.get('/isProfileVerified',isEmployerVerifiedMiddleware,VerifiedProfile);

//verify complete profile
router.get('isProfileCompleted',isEmployerProfileComplete,CompletedProfile);


export default router;