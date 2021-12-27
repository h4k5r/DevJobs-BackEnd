import {Request, Response} from "express";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET?process.env.JWT_SECRET:'';
export const SignUp = (req: Request, res: Response) => {
    res.json({
        message: "SignUp"
    });
}

export const Login = (req: Request, res: Response) => {
    res.json({
        message: "Login"
    });
}

export const ResetPassword = (req: Request, res: Response) => {
    res.json({
        message: "ResetPassword"
    });
}

export const VerifyEmail = (req: Request, res: Response) => {
    res.json({
        message: "VerifyEmail"
    });
}

export const PhoneAuth = (req: Request, res: Response) => {
    res.json({
        message: "PhoneAuth"
    });
}

export const VerifyPhone = (req: Request, res: Response) => {
    res.json({
        message: "VerifyPhone"
    });
}

export const ResendVerificationCode = (req: Request, res: Response) => {
    res.json({
        message: "ResendVerifyPhone"
    });
}
const ValidateToken = async (token:string) => {
    jwt.verify(token, secret,(err, decoded) => {
        return !err;
    });
}