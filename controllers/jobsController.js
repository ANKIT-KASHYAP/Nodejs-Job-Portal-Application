import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

//================CREATE JOBS=================
export const createJobController = async (req,res,next)=>{
    const {company,position} = req.body;
    if(!company || !position){
        next('Please Provide all fieds')
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({job});
};

//================GET JOBS=================

export const getAllJobsController = async (req, res, next)=>{
   const {status,workType,search,sort} =req.query
   //condition for search filters
   const queryObject = {
      createdBy:req.user.userId
   }
   //logic for filters
   if(status && status !== 'all') {
      queryObject.status = status
   }
   if(workType && workType !=='all'){
      queryObject.workType = workType;  
   }
 if(search){
   queryObject.position = {$regex: search, $options:'i'};  
 }
   let queryResult = jobsModel.find(queryObject);

   //====================sorting and  filter========================
   //sorting (-) means latest job 
   if(sort === 'latest'){
      queryResult = queryResult.sort("-createdAt");
   }
//sorting without (-) means oldest job
   if(sort === 'latest'){
      queryResult = queryResult.sort("createdAt");
   }
   //sorting  without (-) means latest job sort by latest position
   if(sort === 'a-z'){
      queryResult = queryResult.sort("position");
   }
//sorting  (-) means oldest job sort by oldest position
   if(sort === 'z-a'){
      queryResult = queryResult.sort("-position");
   }

//===========pagination================

const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) ||10
const skip = (page - 1) *limit
queryResult = queryResult.skip(skip).limit(limit)
//jobs count
const totalJobs = await jobsModel.countDocuments(queryResult)
const numOfPage = Math.ceil(totalJobs / limit)


   const jobs = await queryResult;
   // const jobs = await jobsModel.find({createdBy:req.user.userId})
    res.status(200).json({
      totalJobs,
        jobs,
        numOfPage
    });
};

//================UPDATE JOBS=================

export const updateJobController = async(req,res,next)=>{
    const {id}=req.params
    const {company,position} =req.body
    //validation
     if(!company || !position){
        next('Please Provide All fieds')
     }
     //find jobs
     const job = await jobsModel.findOne({_id:id})
     //validation
     if(!job)
     {
        next(`no jobs found with this id ${id}`)
     }
     if(!req.user.userId === job.createdBy.toString())
     {
        next('You are Not Authorized to update this job');
        return;
     }
     const updateJob = await jobsModel.findOneAndUpdate({_id:id},req.body,{
        new:true,
        runValidators:true
     });
     //res
     res.status(200).json({updateJob});
};

//==============delete jobs===============

export const deleteJobController =async (req,res,next)=>{
    const {id} = req.params
    //first find jobs then delete it
    const job = await jobsModel.findOne({_id:id})
    //validation
     if(!job)
     {
        next(`No job Found with This Id ${id}`)
     }
     if(!req.user.userId === job.createdBy.toString())
     {
        next('You are Not Authorized to update this job');
        return;
     }
     await job.deleteOne()
     res.status(200).json({message:"success, job  Deleted!"});
};

//===================jobs stats and filter============
export const jobStatsController = async (req,res)=>{
   const stats = await jobsModel.aggregate([
      //search by user jobs
      {
$match:{
   createdBy:new mongoose.Types.ObjectId(req.user.userId)
      },
     
   },
   {
      $group:{
         _id:'$status',count:{$sum:1},
      },
   }
   ]);

   //default stats
   const defaultStats = {
      pending: stats.pending || 0 ,
      reject : stats.reject || 0 ,
      interview : stats.interview || 0,

   };

   //yerly monthly stats
   let monthlyApplication = await jobsModel.aggregate([
      {
         $match:{
            createdBy:new mongoose.Types.ObjectId(req.user.userId)
         }
      },
      {
         $group:{
            _id:{
               year:{$year: '$createdAt'},
               month:{$month: '$createdAt'}
            },
         },
      },
   ]);

   monthlyApplication = monthlyApplication.map((item)=>{
      const {_id:{year,month},count,} = item;
      const date = moment().month(month-1).year(year).format("MMM Y");
      return {date,count};
   }).reverse();
   res.status(200).json({totaljob: stats.length, monthlyApplication});
};