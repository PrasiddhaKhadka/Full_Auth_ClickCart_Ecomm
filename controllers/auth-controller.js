const UserSchema = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require("../errors")
const { isTokenValid, attachCookiesToResponse, createTokenUser,sendVerificationEmail } = require('../utils')
const { token } = require('morgan')
const crypto = require('crypto')
// const sendEmail = require('../utils/sendEmail')

const register = async(req,res)=>{
    const {email,name,password} = req.body
    const emailAlreadyExits = await UserSchema.findOne({email})

    if(emailAlreadyExits){
        throw new CustomAPIError.BadRequestError("Email Already Exists")
    }

      // first registered user is an admin
    const isFirstAccount = (await UserSchema.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await UserSchema.create({
        name,
        email,
        password,
        role, 
        verificationToken })

     // FOR LOCAL SERVER FRONTEND
     const origin = 'http://localhost:3000';   

    await sendVerificationEmail({
        email:user.email,
        name:user.name,
        verificationToken:user.verificationToken,
        origin:origin
    })
   
    // SEND VERIFICATION TOKEN BACK ONLY WHILE TESTING IN POSTMAN !!
    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify account ',
        token: verificationToken
    })
}


const verifyEmail = async(req,res)=>{
    const{verificationToken, email} = req.body;
    if(!verificationToken || !email){
        throw new CustomAPIError.BadRequestError('Verification Token or email can not be empty')
    }
    const user = await UserSchema.findOne({email: email})
    if(!user){
        throw new CustomAPIError.BadRequestError('User with this email cannot be found')
    }
    if(user.verificationToken !== verificationToken){
        throw new CustomAPIError.UnauthenticatedError('Verification Failed')
    }
    
    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';

    await user.save();

    res.status(StatusCodes.OK).json({
        msg:"Email Verified",
       verificationToken,
       email
    })
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
        throw new CustomAPIError.UnauthenticatedError('Password is Incorrect')
    }
    if(!user.isVerified){
        throw new CustomAPIError.UnauthenticatedError('Please Verify your email')
    }

    const tokenUser = createTokenUser(user)

    // CREATE REFRESH TOKEN
    let refreshToken =  '';

    // CHECK FOR EXISTING TOKEN 
    const existingToken = await Token.findOne({user:user._id})
    if(existingToken){
        const {isValid} = existingToken
        if(!isValid){
            throw new CustomAPIError.UnauthenticatedError('Invalid Credentials')
        }
        refreshToken = existingToken.refreshToken

        attachCookiesToResponse({res,user:tokenUser,refreshToken})
        res.status(StatusCodes.OK).json({msg:'Success',user:tokenUser})
        return;
    }




    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = { refreshToken, ip, userAgent, user:user._id}

    await Token.create(userToken)

    attachCookiesToResponse({res,user:tokenUser,refreshToken})

    res.status(StatusCodes.OK).json({msg:'Success',user:tokenUser})
}

const logout = async(req,res)=>{
    res.cookie('token','logout',{
        httpOnly:true,
        expiresIn:new Date(Date.now()+5 * 1000)

    })
    res.status(StatusCodes.OK).json({msg:'User Logged Out!'})
}


module.exports = {register, 
    verifyEmail,
    login,
    logout}