const UserSchema = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require("../errors")
const { isTokenValid, attachCookiesToResponse, createTokenUser } = require('../utils')

const register = async(req,res)=>{
    const {email,name,password} = req.body
    const emailAlreadyExits = await UserSchema.findOne({email})

    if(emailAlreadyExits){
        throw new CustomAPIError.BadRequestError("Email Already Exists")
    }

      // first registered user is an admin
    const isFirstAccount = (await UserSchema.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';


    const user = await UserSchema.create({name, email,password, role })
    console.log(user)
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user: tokenUser});
    res.status(StatusCodes.CREATED).json({msg:'Success',user:tokenUser})

}


const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new CustomAPIError.BadRequestError('Email or Password Invalid')
    }
    const user = await UserSchema.findOne({email});
    if(!user){
        throw new CustomAPIError.UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomAPIError.BadRequestError('Password is Incorrect')
    }

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({msg:'Success',user:tokenUser})
}

const logout = async(req,res)=>{
    res.cookie('token','logout',{
        httpOnly:true,
        expiresIn:new Date(Date.now()+5 * 1000)

    })
    res.status(StatusCodes.OK).json({msg:'User Logged Out!'})
}


module.exports = {register, login, logout}