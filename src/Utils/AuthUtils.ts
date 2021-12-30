import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {Employer, EmployerInterface} from "../Models/Employers";
import Applicant, {ApplicantInterface} from "../Models/Applicant";

export const getSalt = async () => {
    return await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!));
};
export const extractToken = (req: Request): string => {
    const authorization = req.headers.authorization;
    if (authorization) {
        return authorization.split(' ')[1];
    }
    return '';
};

export const checkToken = (token: string, secret: string, res: Response, next: NextFunction) => {
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "No token provided"
        });
    }
    let isValid = false;
    jwt.verify(token, secret, (err, _) => {
        if (err) {
            return
        }
        isValid = true;
    });
    if (isValid) {
        next();
        return;
    }
    res.status(400).json({
        success: false,
        message: "Token is invalid"
    });
};

export const getEmployerFromToken: (token:string) => Promise<EmployerInterface | null> = async (token) => {
    const JWT_SECRET: string = process.env.JWT_EMPLOYER_SECRET ? process.env.JWT_EMPLOYER_SECRET : "";
    let employerId: string = "";
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return
        employerId = decoded?._id ? decoded?._id : "";
    });
    const employer: EmployerInterface | null = await Employer.findById(employerId);
    return employer;
}

export const getApplicantFromToken: (token: string) => Promise<ApplicantInterface | null> = async (token) => {
    const JWT_SECRET: string = process.env.JWT_APPLICANT_SECRET ? process.env.JWT_APPLICANT_SECRET : "";
    let applicantId: string = "";
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return
        applicantId = decoded?._id ? decoded?._id : "";
    });
    const applicant: ApplicantInterface | null = await Applicant.findById(applicantId);
    return applicant;
}