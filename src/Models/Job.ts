import {Document, model, Model, Schema} from "mongoose";

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    employer: {
        type: Schema.Types.ObjectId,
        ref: "Employer",
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: "Applicant",
        default: []
    }]
});
export interface JobInterface extends Document {
    title: string,
    description: string,
    employer: {
        type: Schema.Types.ObjectId,
        ref: "Employer",
        required: true
    },
    location: string,
    salary: string,
    currency: string,
    date: Date
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: "Applicant"
    }]
}
export const Job:Model<JobInterface> = model("Job", JobSchema);