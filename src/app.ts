import express from "express";
import dotEnv from "dotenv";
import {connect} from "mongoose";
import bodyParser from "body-parser";
import JobRoutes from "./Routes/JobRoutes";
import ApplicantRoutes from "./Routes/ApplicantRoutes";
import EmployerRoutes from "./Routes/EmployerRoutes";

const app = express();
dotEnv.config();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL? process.env.FRONTEND_URL : "");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,Authorization');
    next();
});
app.use('/employer', EmployerRoutes);
app.use('/applicant', ApplicantRoutes);
app.use('/jobs', JobRoutes)

app.all('*', (req, res) => {
    res.status(404).send("<h1>404 Not found</h1>");
});

connect(process.env.MONGODB_URI ? process.env.MONGODB_URI : "", {}, () => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => console.log("Server started on port " + process.env.PORT));
})


