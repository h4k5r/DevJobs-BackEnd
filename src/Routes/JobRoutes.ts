import express from "express";
import { GetJobs,GetJobById,CreateJob,UpdateJob,DeleteJob } from "../Controllers/JobsController";
import {ValidateToken} from "../Controllers/AuthControllers/EmployerAuthController";

const router = express.Router();

//get all jobs
router.get("/jobs", GetJobs);

//get a job by id
router.get("/jobs/:id", GetJobById);

//create a job
router.post("/jobs",ValidateToken, CreateJob);

//update a job
router.put("/jobs/:id",ValidateToken, UpdateJob);

//delete a job
router.delete("/jobs/:id",ValidateToken, DeleteJob);

export default router;
