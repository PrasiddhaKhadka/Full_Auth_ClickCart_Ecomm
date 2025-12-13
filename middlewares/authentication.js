const CustomApiError = require('../errors/')
const { isTokenValid } = require('../utils')

const authenticationMiddleware = async(req,res,next)=>{
    const token = req.signedCookies.token;

    if(!token){
       throw new CustomApiError.UnauthorizedError('Authentication in Valid')
    }
   
    try {
        const {userId, user, role} = isTokenValid({ token })
        req.user = { userId, user, role}
        next()
    } catch (error) {
        console.log(error);
       throw new CustomApiError.UnauthorizedError('Authentication is not Valid')
    }
}

const authorizePermission = (...rest)=>{
    return (req,res,next)=>{
        if(!rest.includes(req.user.role)){
            throw new CustomApiError.UnauthorizedError('Unauthorized user to access this route')
            }
        next();
    }
}


module.exports = { authenticationMiddleware, authorizePermission };