import {Request, Response} from 'express';
import Applicant from "../Models/Applicant";
import {extractToken} from "../Utils/AuthUtils";
import dotEnv from "dotenv";
import jwt from "jsonwebtoken";
dotEnv.config();
export const GetApplicantProfile = async (req:Request, res:Response) => {
    const token = extractToken(req);
    const applicant = await Applicant.findOne({token:token});
    if(!applicant)
        return res.status(404).json({
            success:false,
            message:"Applicant not found"
        });
    return res.status(200).json({
        success:true,
        message:"Applicant found",
        applicant:applicant
    });
}

export const UpdateApplicantProfile = async (req: Request, res: Response) => {
    const token = extractToken(req);
    let applicantId
    jwt.verify(token,process.env.JWT_APPLICANT_SECRET!,(err,decoded)=>{
        if(err)
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            });
        applicantId = decoded?._id;
    });
    if (!applicantId)
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        });
    const update = req.body;
    const applicant = await Applicant.findOne({_id: applicantId});
    if (!applicant) {
        return res.status(404).send('Applicant not found');
    }
    update.name ? applicant.name = update.name : null;
    //@todo handle resume upload
    const resumeId = "";
    applicant.resume = resumeId;
    //@todo handle cover letter upload
    const coverLetterId = "";
    applicant.coverLetter = coverLetterId;
    applicant.isProfileComplete = true;
    const savedApplicant = await applicant.save();
    if (!savedApplicant) {
        return res.status(500).send('Applicant not saved');
    }
    res.status(200).json({
        success: true,
        message: 'Applicant updated successfully'
    });

}