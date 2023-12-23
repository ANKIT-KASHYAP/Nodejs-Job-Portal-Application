import userModel from "../models/userModel.js";

export const registerController = async(req,res,next)=>{
   
      const {name,email,password} = req.body
      //validate
      if(!name){
        // return res.status(400).send({success:false,message:'please provide name'})
        next("name is required");
      }

      if(!email){
        //return res.status(400).send({success:false,message:'please provide email'})
        next("email is required");
      }

      if(!password){
       // return res.status(400).send({success:false,message:'please provide password'})
        next("password is required and greater than 6 character");
      }

      const existingUser = await userModel.findOne({email})
      if(existingUser)
      {
        next("Email already register Please login with other email");
        // return res.status(200).send({
        //     succcess:false,
        //     message:'Email already register Please login with other email'
        // })
      }

      const user = await userModel.create({name,email,password});
      //token
      const token = user.createJWT()
      res.status(201).send({
        succes:true,
        message:'User created Successfully',
        user:{
            name:user.name,
            lastName:user.lastName,
            email:user.email,
            location:user.location
        },
        token
      });  
};

//login controller fun
export const loginController = async (req,res,next)=>{
  const {email,password} = req.body
  //perform validation
  if(!email || !password)
  {
    next('Please provide all fields')
  } 
  //find user by email
  const user = await userModel.findOne({email}).select("+password")
  if(!user){
    next('Invalid Usrename or Password')
  }

  //compare password
  const isMatch = await user.comparePassword(password)
  if(!isMatch){
    next('Invalid Usrenme or Password')
  }
  user.password = undefined;
  const token  = user.createJWT();
  res.status(200).json({
    success:true,
    message:"Login successfully",
    user,
    token,
  });
};