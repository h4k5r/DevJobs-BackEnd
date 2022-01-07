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

    res.status(200).json({
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
    if (employer.companyName && employer.companyAddress && employer.companyWebsite) {
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
    res.status(200).json({
        success: true,
        verified: savedEmployer.profileComplete,
        employer: {
            companyName: savedEmployer.companyName ? savedEmployer.companyName : "",
            companyAddress: savedEmployer.companyAddress ? savedEmployer.companyAddress : "",
            companyWebsite: savedEmployer.companyWebsite ? savedEmployer.companyWebsite : "",
        }
    });
}
export const GetJobById = async (req:Request,res:Response) => {
    const jobId = req.params.id;
    if (!jobId) {
        res.status(400).send({
            success: false,
            message: "Bad request"
        });
        return;
    }
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
    if (!employer) {
        res.status(401).send({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    // const job:JobInterface | null = await Job.findOne({_id:jobId,employer:employer?._id}).exec();
    const job:JobInterface | null = await Job.findOne({_id:jobId}).exec();
    if (!job) {
        res.status(404).send({
            success: false,
            message: "Job not found"
        });
        return;
    }
    const transformedJob = {
        title: job.title,
        description: job.description,
        salary: job.salary,
        currency: job.currency,
        type: job.type,
        location: job.location,
        requirements: job.requirements,
        responsibilities: job.whatYoullDo,
        formUrl: job.formUrl,
    }
    res.status(200).json({
        success: true,
        job: {...transformedJob}
    })
}
export const GetJobs = async (req:Request, res:Response) => {
    const start = req.query.start?.toString() ? req.query.start.toString() : "0";
    const limit = req.query.limit?.toString() ? req.query.limit.toString() : "10";
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
    if (!employer) {
        res.status(401).send({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const jobs: JobInterface[] = await Job.find({employer:employer._id}).skip(parseInt(start)).limit(parseInt(limit));
    if (jobs.length === 0) {
        res.status(404).send({
            success: false,
            message: "Jobs not found"
        });
        return;
    }
    const transformedJobs = jobs.map((job:JobInterface) => {
        return {
            id: job._id,
            title: job.title,
            type: job.type,
            location: job.location,
            time: job.date,
        }
    })
    res.status(200).json({
        success: true,
        jobs: transformedJobs
    })

}
