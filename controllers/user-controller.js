const UserSchema = require('../models/User')
const CustomAPIError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { createTokenUser, attachCookiesToResponse, checkPermission } = require('../utils')

const getAllUsers = async(req,res)=>{
    // console.log(req.user);
    const users = await UserSchema.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({msg:'Success',users:users})
}

const getSingleUser = async(req,res)=>{

    const id = req.params.id;
    const user = await UserSchema.findOne({_id:id, role:'user'}).select('-password');
    if(!user){
        throw new CustomAPIError.NotFoundError(`User with ${id} not found`);
    }
    checkPermission(req.user,user._id)
    res.status(StatusCodes.OK).json({
        msg:"Success",
        user:user
    })
}


const showCurrentUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({msg:"Success",user:req.user})
}

// 😍😍😍 UPDATING THR USER USING FIND ONE AND UPDATE 😍😍😍
// const updateUser = async(req,res)=>{
//     const {email, name} = req.body;
//     if(!email || !name){
//         throw new CustomAPIError.BadRequestError("Email and Name cannot be empty")
//     }

//     const user = await UserSchema.findOneAndUpdate(
//         {_id:req.user.userId},
//         {email,name},
//         {new:true, runValidators:true}
//     )
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({res,user:tokenUser})
//     res.status(StatusCodes.OK).json({msg:tokenUser})
// } 




/// 😍😍😍 UPDATING THR USER USING USER.SAVE() 😍😍😍

const updateUser = async(req,res)=>{

    const {name,email} = req.body;

    if(!email || !name){
        throw new CustomAPIError.BadRequestError('Please Provide all Values');
    }
    const user = await UserSchema.findOne({ _id: req.user.userId });
    user.email = email
    user.name = name
    await user.save()
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({msg:'Success',user:tokenUser})

}



const updateUserPassword = async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomAPIError.BadRequestError('Old password or new password is missing')
    }
    const user = await UserSchema.findOne({_id:req.user.userId});
    if(!user){
        throw new CustomAPIError.NotFoundError('User not found')
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomAPIError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword
    await user.save();


    res.status(StatusCodes.OK).json({msg:'Success, The password has been updated'})
}

const deleteUser = async(req,res)=>{
    res.status(200).json({msg:"Hello World from delete password current User"})
}

module.exports={
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser,
}