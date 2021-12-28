import {Document, model, Model, Schema} from 'mongoose';

const applicant = new Schema({
    name: {
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
    verificationToken: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        required: false
    },
    isProfileComplete: {
        type: Boolean,
        required: false
    },
    resume: {
        type: String,
        required: false
    },
    coverLetter: {
        type: String,
        required: false
    },
    appliedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
});

export interface ApplicantInterface extends Document {
    name: string;
    email: string;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    verificationToken: string;
    isVerified: boolean;
    isProfileComplete: boolean;
    resume: string;
    coverLetter: string;
    appliedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }];
}

const Applicant: Model<ApplicantInterface> = model('Applicant', applicant);

export default Applicant;

