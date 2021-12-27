import {Router} from "express";
import {
    SignUp,
    Login,
    VerifyEmail,
    ResetPassword,
    PhoneAuth,
    VerifyPhone,
    ResendVerificationCode
} from "../../Controllers/AuthControllers/JobSeekerAuthController";

const router = Router();
//create a new user
router.post("/signup", SignUp);

//login a user
router.post("/login", Login);

//reset password
router.post("/reset-password", ResetPassword);

//verify email
router.get("/verify-email", VerifyEmail);

// phone auth
router.post("/phone-auth", PhoneAuth);

//verify phone
router.post("/verify-phone", VerifyPhone);

//resend phone code
router.get("/resend-phone-code", ResendVerificationCode);

export default router;