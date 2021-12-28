import {Document, model, Model, Schema} from "mongoose";

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
    isVerified: {
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
    isVerified: boolean,
    verificationToken: string,
    profileComplete: boolean,
    companyWebsite: string,
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: "Job",
        default: []
    }]
}

export const Employer: Model<EmployerInterface> = model("Employer", EmployerSchema);



