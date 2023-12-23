import express from 'express'
import userAuth from '../middelwares/authMiddleware.js'
import { createJobController, deleteJobController, getAllJobsController, jobStatsController, updateJobController } from '../controllers/jobsController.js'
const router = express.Router()

//routes
//CREATE JOB ||POST
router.post('/create-job',userAuth,createJobController)
//Get JOB ||GET
router.get('/get-job',userAuth,getAllJobsController);
//UPDATE  JOBS || PUT ||PATCH
router.patch('/update-job/:id',userAuth,updateJobController);
//DELETE  JOBS || DELETE ||PATCH
router.delete('/delete-job/:id',userAuth,deleteJobController);
//JOB STATS FILTER || GET 
router.get('/job-stats',userAuth,jobStatsController);

export default router;