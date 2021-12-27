import {NextFunction, Request, Response} from "express";
import dotEnv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import {Employer} from "../../Models/Employers";


dotEnv.config();
const secret = process.env.JWT_EMPLOYER_SECRET ? process.env.JWT_EMPLOYER_SECRET : 'defaultEmployerSecret';
const saltRounds: number = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 12;
const hourInMilliseconds: number = 3600000;

export const SignUp = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }

    const user = await Employer.findOne({email});
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployer = new Employer({
        email,
        password: hashedPassword,
        verify: false

    });
    const saved = await newEmployer.save();
    if (saved) {
        return res.status(200).json({
            success: true,
            message: "User created successfully"
        });
    }
    return res.status(500).json({
        success: false,
        message: "User not created"
    });


}

export const Login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }
    const user = await Employer.findOne({email});
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Incorrect password"
        });
    }

    const token = jwt.sign({_id: user._id}, secret, {
        expiresIn: '24h',
    });
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token
    });

}

export const ResetPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }
    const user = await Employer.findOne({email});
    if (user) {
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + hourInMilliseconds);
        const saved = await user.save();
        // send email with token link
        // if (saved) {
        //     return res.status(200).json({
        //         success: true,
        //         message: "Reset password link sent successfully"
        //     });
        // }
        return res.status(500).json({
            success: false,
            message: "Reset password link not sent"
        });
    }
    res.json({
        message: "If User exists, email will be sent"
    });
}

export const ResetToken = async (req: Request, res: Response) => {
    const token = req.params.token;
    const {password} = req.body;
    // console.log(token, password);
    const employer = await Employer.findOne({resetPasswordToken: token});
    if (!employer) {
        return res.status(400).json({
            success: false,
            message: "Token is invalid or expired"
        });
    }
    if (employer.resetPasswordExpires < new Date(Date.now())) {
        return res.status(400).json({
            success: false,
            message: "Token is invalid or expired"
        });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    employer.password = await bcrypt.hash(password, salt);
    employer.resetPasswordToken = "";
    employer.resetPasswordExpires = new Date(0);
    const saved = await employer.save();
    if (saved) {
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }
    return res.status(500).json({
        success: false,
        message: "Password not changed"
    });

}

export const ValidateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "No token provided"
        });
    }
    if (isTokenValid(token)) {
        next();
        return;
    }
    return res.status(400).json({
        success: false,
        message: "Token is invalid"
    });
}
const isTokenValid: (token: string) => boolean = (token: string) => {
    let isValid = false;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return
        }
        isValid = true;
    });
    return isValid;
}