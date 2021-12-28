import express from "express";
import {GetJobs, GetJobById, CreateJob, UpdateJob, DeleteJob} from "../Controllers/JobsController";
import {
    ApplicantTokenValidateMiddleware,
    EmployerTokenValidateMiddleware, isApplicantVerifiedMiddleware,
    isEmployerVerifiedMiddleware
} from "../Middlewares/AuthMiddleware";

const router = express.Router();

//get all jobs
router.get("/", GetJobs);

//get a job by id
router.get("/:id", GetJobById);

//create a job
router.post("/", EmployerTokenValidateMiddleware, isEmployerVerifiedMiddleware, CreateJob);

//update a job
router.put("/:id", EmployerTokenValidateMiddleware, isEmployerVerifiedMiddleware, UpdateJob);

//delete a job
router.delete("/:id", EmployerTokenValidateMiddleware, isEmployerVerifiedMiddleware, DeleteJob);

//apply to a job
router.post("/:id/apply", ApplicantTokenValidateMiddleware, isApplicantVerifiedMiddleware);

export default router;
