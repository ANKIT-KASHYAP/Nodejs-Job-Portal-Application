import express from 'express'
import { testPostContoller } from '../controllers/testController.js'
import userAuth from '../middelwares/authMiddleware.js'

//router object
const router = express.Router()


//routes
//router.post('/test',(req,rep)=>{})
//(req,rep)=>{} iss function ko hmm MVC model way m likhenge means iss fun ko controller folder m likhenge and uss fun ko yha per import krke use krenge
router.post('/test-post',userAuth,testPostContoller)
//export
export default router
