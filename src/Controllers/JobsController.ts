import {Request, Response} from "express";
import dotEnv from "dotenv";
import jwt from "jsonwebtoken";
import {Employer, EmployerInterface} from "../Models/Employers";
import {Job, JobInterface} from "../Models/Job";
import {extractToken} from "../Utils/AuthUtils";
import Applicant, {ApplicantInterface} from "../Models/Applicant";


dotEnv.config()

export const GetJobs = async (req: Request, res: Response) => {
    const start = req.query.start?.toString() ? req.query.start.toString() : "0";
    const end = req.query.end?.toString() ? req.query.end.toString() : "10";
    const jobs: JobInterface[] = await Job.find({}).skip(parseInt(start)).limit(parseInt(end));
    if (jobs.length > 0) {
        res.status(200).json({
            success: true,
            jobs: jobs
        });
    } else {
        res.status(404).json({
            success: false,
            message: "No jobs found"
        });
    }
}

export const GetJobById = async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (job) {
        res.status(200).json({
            success: true,
            message: "Job found",
            job
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Job not found"
        });
    }
}

export const CreateJob = async (req: Request, res: Response) => {
    const employer: EmployerInterface | null = await getEmployerFromToken(req);
    if (!employer) return res.status(404).json({message: "Employer Not Found"});
    const postedJob = req.body.job;
    let isPostedJobValid: boolean = false
    if (postedJob.title &&
        postedJob.description &&
        postedJob.salary &&
        postedJob.location &&
        postedJob.currency.length === 1) {
        isPostedJobValid = true;
    }
    if (!isPostedJobValid) return res.status(400).json({message: "Invalid Job"});
    const job: JobInterface = new Job({
        title: postedJob.title,
        description: postedJob.description,
        salary: postedJob.salary,
        location: postedJob.location,
        currency: postedJob.currency,
        employer: employer?._id
    });
    employer.jobs.push(job._id);
    const savedJob: JobInterface | null = await job.save();
    const savedEmployer: EmployerInterface | null = await employer.save();
    if (!savedJob || !savedEmployer) return res.status(500).json({message: "Internal Server Error"});
    res.json({
        success: true,
        message: "Job Created"
    });
}

export const UpdateJob = async (req: Request, res: Response) => {
    const employer: EmployerInterface | null = await getEmployerFromToken(req);
    if (!employer) return res.status(404).json({message: "Employer Not Found"});
    const jobId = req.params.id;
    if (!employer.jobs.find(job => job.toString() === jobId)) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found"
        });
    }
    const job: JobInterface | null = await Job.findById(jobId);
    if (!job) return res.status(404).json({message: "Job Not Found"});
    const postedJob = req.body.job;
    if (!postedJob) {
        return res.status(400).json({message: "Invalid Job"});
    }
    if (postedJob.title) job.title = postedJob.title;
    if (postedJob.description) job.description = postedJob.description;
    if (postedJob.salary) job.salary = postedJob.salary;
    if (postedJob.location) job.location = postedJob.location;
    if (postedJob.currency) job.currency = postedJob.currency;
    const savedJob: JobInterface | null = await job.save();
    if (!savedJob) return res.status(500).json({message: "Internal Server Error"});
    res.json({
        success: true,
        message: "Updated Job"
    });
}

export const DeleteJob = async (req: Request, res: Response) => {
    const employer: EmployerInterface | null = await getEmployerFromToken(req);
    if (!employer) return res.status(404).json({message: "Employer Not Found"});
    const jobId = req.params.id;
    if (!employer.jobs.find(job => job.toString() === jobId)) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found"
        });
    }
    const job: JobInterface | null = await Job.findById(jobId);
    if (!job) return res.status(404).json({message: "Job Not Found"});
    const deletedJob: JobInterface | null = await job.remove();
    if (!deletedJob) return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
    res.json({
        success: true,
        message: "Delete Job"
    });
}

export const ApplyToJob = async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const job: JobInterface | null = await Job.findById(jobId);
    if (!job)
        return res.status(404).json({
            success: false,
            message: "Job Not Found"
        });
    const applicant: ApplicantInterface | null = await getApplicantFromToken(req);
    if (!applicant)
        return res.status(404).json({
            success: false,
            message: "Applicant Not Found"
        });
    if (job.applicants.find(jobApplicant => jobApplicant.toString() === applicant._id.toString()))
        return res.status(400).json({
            success: false,
            message: "Already Applied"
        });

    job.applicants.push(applicant._id);
    applicant.appliedJobs.push(job._id);
    const savedJob: JobInterface | null = await job.save();
    const savedApplicant: ApplicantInterface | null = await applicant.save();
    if (!savedJob || !savedApplicant)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    res.json({
        success: true,
        message: "Applied to Job"
    });
}

const getEmployerFromToken: (req: Request) => Promise<EmployerInterface | null> = async (req: Request) => {
    const token: string = extractToken(req);
    const JWT_SECRET: string = process.env.JWT_EMPLOYER_SECRET ? process.env.JWT_EMPLOYER_SECRET : "";
    let employerId: string = "";
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return
        employerId = decoded?._id ? decoded?._id : "";
    });
    const employer: EmployerInterface | null = await Employer.findById(employerId);
    return employer;
}

const getApplicantFromToken: (req: Request) => Promise<ApplicantInterface | null> = async (req: Request) => {
    const token: string = extractToken(req);
    const JWT_SECRET: string = process.env.JWT_APPLICANT_SECRET ? process.env.JWT_APPLICANT_SECRET : "";
    let applicantId: string = "";
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return
        applicantId = decoded?._id ? decoded?._id : "";
    });
    const applicant: ApplicantInterface | null = await Applicant.findById(applicantId);
    return applicant;
}
