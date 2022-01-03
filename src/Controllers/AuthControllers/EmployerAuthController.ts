import {Request, Response} from "express";
import dotEnv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendGrid from "@sendgrid/mail";
import * as crypto from "crypto";
import {Employer} from "../../Models/Employers";
import {getSalt} from "../../Utils/AuthUtils";


dotEnv.config();

const hourInMilliseconds: number = 3600000;

export const SignUp = async (req: Request, res: Response) => {
    const {email, password, confirmPassword} = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }
    const employer = await Employer.findOne({email});
    if (employer) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!));
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const newEmployer = new Employer({
        email,
        password: hashedPassword,
        verify: false,
        verificationToken
    });
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY!);
    const msg = {
        to: email,
        from: 'rahul16086@gmail.com',
        subject: 'Verify your email',
        text: 'click on the link to verify your email',
        html: `<a href="${process.env.FRONTEND_URL}/api/verify/employer/${verificationToken}">Verify</a>`
    }
    const response = await sendGrid.send(msg);
    if (!response) {
        return res.status(500).json({
            success: false,
            message: "Error sending email"
        });
    }
    const saved = await newEmployer.save();

    if (!saved) {
        return res.status(500).json({
            success: false,
            message: "User not created"
        });
    }
    return res.status(200).json({
        success: true,
        message: "User created successfully"
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
    const employer = await Employer.findOne({email});
    if (!employer) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        });
    }
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Incorrect password"
        });
    }

    const token = jwt.sign({_id: employer._id}, process.env.JWT_EMPLOYER_SECRET!, {
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
    if (!user) {
        return res.json({
            message: "If User exists, email will be sent"
        });
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = new Date(Date.now() + hourInMilliseconds);
    const updated = await user.save();
    if (!updated) {
        return res.status(500).json({
            success: false,
            message: "Reset password link not sent"
        });
    }
    // send email with token link

    return res.status(200).json({
        success: true,
        message: "Reset password link sent successfully"
    });


}

export const ResetToken = async (req: Request, res: Response) => {
    const token = req.params.token;
    const {password, confirmPassword} = req.body;
    // console.log(token, password);
    if (!password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }
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
    const salt = await getSalt();
    employer.password = await bcrypt.hash(password, salt);
    employer.resetPasswordToken = "";
    employer.resetPasswordExpires = new Date(0);
    const saved = await employer.save();
    if (!saved) {
        return res.status(500).json({
            success: false,
            message: "Password not changed"
        });
    }
    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
}

export const VerifyEmployer = async (req: Request, res: Response) => {
    const token = req.params.token;
    console.log(token);
    const employer = await Employer.findOne({verificationToken: token});
    if (!employer) {
        return res.status(400).json({
            success: false,
            message: "Token is invalid or expired"
        });
    }
    employer.isVerified = true;
    employer.verificationToken = "";
    const saved = await employer.save();
    if (!saved) {
        return res.status(500).json({
            success: false,
            message: "User not verified"
        });
    }
    res.status(200).json({
        success: true,
        message: "User verified successfully"
    });
}

export const ValidToken = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Token is valid"
    });
}
export const VerifiedProfile = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Employer is verified"
    });
}
export const CompletedProfile = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Employer profile is completed"
    });
}
