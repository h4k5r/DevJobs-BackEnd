import { Schema, Document, model, Model} from "mongoose";
const EmployerSchema = new Schema({
    companyName: {
        type: String,
        required: false
    },
    companyAddress: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    profileComplete: {
        type: Boolean,
        default: false
    },

    companyWebsite: {
        type: String,
        required: false
    },
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: "Job",
        default: []
    }]
})

export interface EmployerInterface extends Document {
    _id: Schema.Types.ObjectId;
    companyName: string,
    companyAddress: string,
    email: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordExpires: Date,
    verified: boolean,
    verificationToken: string,
    profileComplete: boolean,
    companyWebsite: string,
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: "Job",
        default: []
    }]
}
export const Employer:Model<EmployerInterface> = model("Employer", EmployerSchema);



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
    }
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
}
export const Job:Model<JobInterface> = model("Job", JobSchema);