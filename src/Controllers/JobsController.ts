import {Request, Response} from "express";
import dotEnv from "dotenv";
import {Employer, EmployerInterface} from "../Models/Employers";
import {Job, JobInterface, responseJobInterface} from "../Models/Job";
import {extractToken, getApplicantFromToken, getEmployerFromToken} from "../Utils/AuthUtils";
import {ApplicantInterface} from "../Models/Applicant";


dotEnv.config()

export const GetJobs = async (req: Request, res: Response) => {
    const start = req.query.start?.toString() ? req.query.start.toString() : "0";
    const limit = req.query.limit?.toString() ? req.query.limit.toString() : "10";
    const jobs: JobInterface[] = await Job.find({}).skip(parseInt(start)).limit(parseInt(limit));
    const transformedJobs = jobs.map(async (job) => {
        const employer: EmployerInterface | null = await Employer.findById(job.employer);
        if (!employer) {
            return;
        }
        return {
            id: job._id,
            title: job.title,
            type: job.type,
            company: employer.companyName,
            location: job.location,
            time: job.date.toDateString(),
            company_logo: "",
        }
    });
    if (transformedJobs.length > 0) {
        res.status(200).json({
            success: true,
            jobs: await Promise.all(transformedJobs),
        });
    } else {
        res.status(200).json({
            success: false,
            message: "No jobs found"
        });
    }
}

export const GetJobById = async (req: Request, res: Response) => {
    const jobId = req.params.id;
    let job: JobInterface | null
    try {
        job = await Job.findById(jobId);
    } catch (e) {
        return;
    }
    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job not found"
        });
    }
    const employer: EmployerInterface | null = await Employer.findById(job.employer);
    if (!employer) {
        return res.status(404).json({
            success: false,
            message: "Employer not found"
        });
    }
    const transformedJob: responseJobInterface = {
        id: job._id,
        title: job.title,
        type: job.type,
        description: job.description,
        company: employer.companyName,
        location: job.location,
        url: job.formUrl,
        created_at: job.date.toDateString(),
        company_logo: "",
        company_url: employer.companyWebsite,
        requirements: job.requirements,
        what_you_will_do: job.whatYoullDo,
        salary: job.salary,
    };
    res.status(200).json({
        success: true,
        message: "Job found",
        job: {
            ...transformedJob
        }
    });
}

export const SearchJob = async (req: Request, res: Response) => {
    console.log('search triggered')
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const type = req.query.type || "";
    const jobs: JobInterface[] | null = await Job.find({
        $or: [
            {title: {$regex: keyword, $options: 'i'}},
            {location: {$regex: location, $options: 'i'}},
            {type: {$regex: type, $options: 'i'}},
        ]
    }).exec();
    if (!jobs) {
        return res.status(404).json({
            success: false,
            message: "No jobs found"
        });
    }
    const transformedJobs = jobs.map(async (job) => {
        const employer: EmployerInterface | null = await Employer.findById(job.employer);
        if (!employer) {
            return;
        }
        return {
            id: job._id,
            title: job.title,
            type: job.type,
            company: employer.companyName,
            location: job.location,
            time: job.date.toDateString(),
            company_logo: "",
        }
    });
    if (transformedJobs.length > 0) {
        return res.status(200).json({
            success: true,
            jobs: await Promise.all(transformedJobs),
        });
    }
    res.status(200).json({
        success: false,
        message: "No jobs found"
    });
}

export const CreateJob = async (req: Request, res: Response) => {
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
    if (!employer) return res.status(404).json({message: "Employer Not Found"});
    const postedJob = req.body.job;
    console.log(postedJob);
    let isPostedJobValid: boolean = false
    if (postedJob.title &&
        postedJob.description &&
        postedJob.salary &&
        postedJob.location &&
        postedJob.currency.length === 1 &&
        postedJob.requirements &&
        postedJob.whatYoullDo &&
        postedJob.type &&
        postedJob.formUrl) {
        postedJob.requirements = postedJob.requirements.split(",");
        postedJob.whatYoullDo = postedJob.whatYoullDo.split(",");
        if (postedJob.requirements.length > 0 && postedJob.whatYoullDo.length > 0) {
            isPostedJobValid = true;
        }
    }
    if (!isPostedJobValid) return res.status(400).json({message: "Invalid Job"});
    const job: JobInterface = new Job({
        title: postedJob.title,
        description: postedJob.description,
        salary: postedJob.salary,
        location: postedJob.location,
        currency: postedJob.currency,
        employer: employer?._id,
        requirements: postedJob.requirements,
        whatYoullDo: postedJob.whatYoullDo,
        type: postedJob.type,
        formUrl: postedJob.formUrl
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
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
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
    const employer: EmployerInterface | null = await getEmployerFromToken(extractToken(req));
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
    const applicant: ApplicantInterface | null = await getApplicantFromToken(extractToken(req));
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




