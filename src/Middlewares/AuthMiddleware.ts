import {NextFunction, Request, Response} from "express";
import dotEnv from "dotenv";
import {checkToken, extractToken} from "../Utils/AuthUtils";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Employer} from "../Models/Employers";
import Applicant from "../Models/Applicant";

dotEnv.config();

export const EmployerTokenValidateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const employerSecret = process.env.JWT_EMPLOYER_SECRET ? process.env.JWT_EMPLOYER_SECRET : 'defaultEmployerSecret';
    checkToken(extractToken(req), employerSecret, res, next);
}

export const ApplicantTokenValidateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const applicantSecret = process.env.JWT_APPLICANT_SECRET ? process.env.JWT_APPLICANT_SECRET : 'defaultApplicantSecret';
    checkToken(extractToken(req), applicantSecret, res, next);
}

export const isEmployerVerifiedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);
    const employerSecret = process.env.JWT_EMPLOYER_SECRET ? process.env.JWT_EMPLOYER_SECRET : 'defaultEmployerSecret';
    const payload: JwtPayload = jwt.verify(token, employerSecret) as JwtPayload;
    const employer = await Employer.findOne({_id: payload._id});
    if (!employer) {
        return res.status(401).json({
            success: false,
            message: "Employer not found"
        })
    }
    if (!employer.isVerified) {
        return res.status(401).json({
            success: false,
            message: "Employer not verified"
        })
    }
    next();

}

export const isApplicantVerifiedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);
    const applicantSecret = process.env.JWT_APPLICANT_SECRET ? process.env.JWT_APPLICANT_SECRET : 'defaultApplicantSecret';
    const payload: JwtPayload = jwt.verify(token, applicantSecret) as JwtPayload;
    const applicant = await Applicant.findOne({_id: payload._id});
    if (!applicant) {
        return res.status(401).json({
            success: false,
            message: "Applicant not found"
        })
    }
    if (!applicant.isVerified) {
        return res.status(401).json({
            success: false,
            message: "Applicant not verified"
        })
    }
    next();
}





