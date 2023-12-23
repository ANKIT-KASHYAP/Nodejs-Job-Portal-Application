//we use import export approch i.e ES6
//const express = require('express')
//packages ke imports
import express from "express";
//API DOCUMENTATION
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from 'swagger-jsdoc'
import "express-async-errors"
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from "morgan";
import cors from 'cors'
//security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from'express-mongo-sanitize';
//files import
import connectDB from "./config/db.js"
//routesimport
import testRoutes from './routes/testRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorMiddleware from "./middelwares/errorMiddleware.js";
import jobsRoutes from './routes/jobsRoutes.js'
import userRoutes from './routes/userRoutes.js'


//Dot Env Configure if we made .env file in root 
dotenv.config(); 

//mongodb connection
connectDB();

//swagger spi config
//swagger spi options
const options ={
    definition:{
        openapi:"3.0.0",
        info:{
            title:'Job Portal Aapplication',
            description:'Node ExpressJs Job Portal application'
    
        },
        servers:[{
            // url:"http://localhost:8080"
            url:"https://nodejs-job-portal-application.onrender.com",
        }
    ]
    },
    apis:['./routes/*.js'],
   
};
const spec = swaggerDoc(options)

//rest objects
const app = express();

//middelwares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//routes
// app.get('/',(req,res)=>{
//     res.send("<h1>Welcome To New Job portal</h1>")

// });
app.use('/api/v1/test',testRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/job',jobsRoutes);

//homeroute root
app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(spec));

//validation middleware ise routes ke bad isliye use kra sothat age ka code block na ho jae
app.use(errorMiddleware)
//Firt extract the port from env file
const PORT = process.env.PORT || 8080
//listen
app.listen(PORT,()=>{
    console.log(`Node Server Is Running in ${process.env.DEV_MODE} mode on Port no. ${PORT}`.bgCyan.white)     
    
})
