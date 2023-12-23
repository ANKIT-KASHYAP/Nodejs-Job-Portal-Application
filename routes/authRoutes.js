import express from 'express'
import { loginController, registerController } from '../controllers/authController.js'
import rateLimit from 'express-rate-limit';

//IP limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})



//route object
const router = express.Router()
//routes

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: Object
 *      required:
 *       -name
 *       -email
 *       -password
 *       -location
 *      properties:
 *       id:
 *          type: string
 *          description: The Auto_generated id of user collection
 *       name:
 *          type: string
 *          description: User name
 *       lastName:
 *          type: string
 *          description: User Last Name
 *       email:
 *          type: string
 *          description: User email address
 *       password:
 *          type: string
 *          description: user password should be greater than 6 character
 *       location:
 *          type: string
 *          description: User location city or country
 *      example:
 *       id: YRIYD99588DFDH
 *       name: John
 *       lastName: Doe
 *       email: johndoes@gmail.com
 *       password: test@123
 *       location: mumbai
 */


/**
 * @swagger
 *  tags:
 *    name: auth
 *    description: authentication apis 
 */  


/**
 * @swagger
 *  /api/v1/auth/register:
 *      post:
 *         summary: register new user
 *         tags: [Auth]
 *         requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/User'
 *         responses:
 *              200:
 *                  description: user created successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: internal server error
 *                              
 *                                                
 *              
 */
//For Usre Register with method || POST
router.post('/register',limiter,registerController);
/** 
 * @swagger
 *  /api/v1/auth/login:
 *      post:
 *         summary: login page
 *         tags: [Auth]
 *         requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/User'
 *         responses:
 *              200:
 *                  description: login successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: somthing went wrong
 *                              
 *                                                
 *              
 */
//For Usre Login with method || POST
router.post('/login',limiter,loginController);

//export
export default router