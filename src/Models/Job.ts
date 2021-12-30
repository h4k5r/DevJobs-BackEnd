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
    type: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    whatYoullDo: {
        type: [String],
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
    formUrl: {
        type: String,
        required: true
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
    requirements: string[],
    whatYoullDo: string[],
    type: string,
    employer: {
        type: Schema.Types.ObjectId,
        ref: "Employer",
        required: true
    },
    location: string,
    salary: string,
    currency: string,
    date: Date
    formUrl: string,
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: "Applicant"
    }]
}
export interface responseJobInterface {
    id: string;
    title: string;
    type: string;
    description: string;
    company: string;
    company_url: string;
    company_logo: string;
    location: string;
    url: string;
    requirements: string[];
    what_you_will_do: string[];
    salary: string;
    created_at: string;
}
export const Job:Model<JobInterface> = model("Job", JobSchema);