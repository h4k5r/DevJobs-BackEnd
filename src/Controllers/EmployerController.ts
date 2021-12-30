import {Request, Response} from "express";
import {extractToken, getEmployerFromToken} from "../Utils/AuthUtils";
import {EmployerInterface} from "../Models/Employers";
import {Job, JobInterface} from "../Models/Job";

export const GetProfile = async (req: Request, res: Response) => {
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
    if (!employer) {
        res.status(401).send({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const jobs = await Job.find({employer: employer._id}).exec();
    console.log(jobs);

    res.status(200).send({
        success: true,
        employer: {
            companyName: employer.companyName ? employer.companyName : "",
            companyAddress: employer.companyAddress ? employer.companyAddress : "",
            companyWebsite: employer.companyWebsite ? employer.companyWebsite : "",
            // @toDo: Add company logo
        }
    });
}
export const UpdateProfile = async (req: Request, res: Response) => {
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
    if (!employer) {
        res.status(401).send({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const {companyName, companyAddress, companyWebsite} = req.body;
    if (companyName) {
        employer.companyName = companyName;
    }
    if (companyAddress) {
        employer.companyAddress = companyAddress;
    }
    if (companyWebsite) {
        employer.companyWebsite = companyWebsite;
    }
    if(employer.companyName && employer.companyAddress && employer.companyWebsite) {
        employer.profileComplete = true;
    }
    const savedEmployer = await employer.save();
    if (!savedEmployer) {
        res.status(500).send({
            success: false,
            message: "Error saving employer"
        });
        return;
    }
    res.status(200).send({
        success: true,
        verified: savedEmployer.profileComplete,
        employer: {
            companyName: savedEmployer.companyName ? savedEmployer.companyName : "",
            companyAddress: savedEmployer.companyAddress ? savedEmployer.companyAddress : "",
            companyWebsite: savedEmployer.companyWebsite ? savedEmployer.companyWebsite : "",
        }
    });
}
