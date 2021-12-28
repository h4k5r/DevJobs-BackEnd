import {Request, Response} from 'express';
import dotEnv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import Applicant from '../../Models/Applicant';
import {getSalt} from "../../Utils/AuthUtils";

dotEnv.config();

const hourInMilliseconds = 3600000;

export const SignUp = async (req: Request, res: Response) => {
    const {email, password, confirmPassword, name} = req.body;
    if (!email || !password || !confirmPassword || !name) {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }
    const applicant = await Applicant.findOne({email});
    if (applicant) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!));
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const newApplicant = new Applicant({
        email,
        password: hashedPassword,
        name,
        verificationToken
    });
    const savedApplicant = await newApplicant.save();
    if (!savedApplicant) {
        return res.status(500).json({
            message: "Error while saving applicant"
        });
    }
    //@todo send email with verification token
    return res.status(200).json({
        success: true,
        message: "Applicant created successfully"
    });
}

export const Login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }
    const applicant = await Applicant.findOne({email});
    if (!applicant) {
        return res.status(400).json({
            success: false,
            message: "Email does not exist"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, applicant.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Password is incorrect"
        });
    }
    const token = jwt.sign({
        _id: applicant._id
    }, process.env.JWT_APPLICANT_SECRET!, {
        expiresIn: "24h"
    });
    return res.status(200).json({
        success: true,
        message: "Login successful",
        token
    });
}

export const ResetPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }
    const applicant = await Applicant.findOne({email});
    if (!applicant) {
        return res.status(400).json({
            success: false,
            message: "Email does not exist"
        });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + hourInMilliseconds;
    applicant.resetPasswordToken = token;
    applicant.resetPasswordExpires = new Date(expires);
    console.log()
    const updatedApplicant = await applicant.save();
    if (!updatedApplicant) {
        return res.status(500).json({
            success: false,
            message: "Error while updating applicant"
        });
    }
    //@todo send email with token link
    return res.status(200).json({
        success: true,
        message: "Reset password link sent successfully"
    });
}

export const ResetToken = async (req: Request, res: Response) => {
    const token = req.params.token;
    const {password, confirmPassword} = req.body;
    if (!password || !confirmPassword) {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }
    const applicant = await Applicant.findOne({resetPasswordToken: token});
    if (!applicant) {
        return res.status(400).json({
            success: false,
            message: "Invalid token or token expired"
        });
    }
    if (applicant.resetPasswordExpires.getTime() < Date.now()) {
        return res.status(400).json({
            success: false,
            message: "Invalid token or token expired"
        });
    }
    const salt = await getSalt();
    applicant.password = await bcrypt.hash(password, salt);
    applicant.resetPasswordToken = "";
    applicant.resetPasswordExpires = new Date(0);
    const savedApplicant = await applicant.save();
    if (!savedApplicant) {
        return res.status(500).json({
            success: false,
            message: "Error while saving applicant"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Password reset successful"
    });
}

export const VerifyApplicant = async (req:Request,res:Response) => {
    const token = req.params.token;
    const applicant = await Applicant.findOne({verificationToken:token});
    if (!applicant) {
        return res.status(400).json({
            success: false,
            message: "Invalid token"
        });
    }
    applicant.isVerified = true;
    applicant.verificationToken = "";
    const savedApplicant = await applicant.save();
    if (!savedApplicant) {
        return res.status(500).json({
            success: false,
            message: "Error while saving applicant"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Applicant verified successfully"
    });
}




