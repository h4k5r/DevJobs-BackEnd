import express from "express";
import dotEnv from "dotenv";
import {connect} from "mongoose";
import bodyParser from "body-parser";
import EmployerAuth from "./Routes/AuthRoutes/EmployerAuthRoutes";
import JobSeekerAuth from "./Routes/AuthRoutes/JobSeekerAuthRoutes";
import JobRoutes from "./Routes/JobRoutes";

const app = express();
dotEnv.config();
app.use(bodyParser.json());
app.use('/auth/jobSeeker',JobSeekerAuth);
app.use('/auth/employer',EmployerAuth);
app.use(JobRoutes)

app.all('*',(req,res,next)=>{
    res.status(404).send("<h1>404 Not found</h1>");
});

connect(process.env.MONGODB_URI? process.env.MONGODB_URI :"",{},()=>{
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => console.log("Server started on port "+process.env.PORT));
})


