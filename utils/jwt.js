const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const createJwt = ({payload})=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,
        // {
        //     expiresIn:process.env.JWT_LIFETIME,
        // }
    );
    return token;
}


const isTokenValid = (token) => jwt.verify(token,process.env.JWT_SECRET);

const attachCookiesToResponse = ({res, user,refreshToken}) => {
    const accessTokenJWT = createJwt({payload:{ user }})
    const refreshTokenJWT = createJwt({payload: { user, refreshToken}})

    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('accessToken',accessTokenJWT,{
        httpOnly:true,
        // expires:new Date(Date.now()+ oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed:true,
        maxAge:1000 * 60 * 15,
    });
     res.cookie('refreshToken',refreshTokenJWT,{
        httpOnly:true,
        expires:new Date(Date.now()+ oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed:true,
    })
}


const attachSingleCookiesToResponse = ({res, user,refreshToken}) => {
    const token = createJwt({payload:user})
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+ oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed:true,
    })
}



module.exports={
    createJwt,
    isTokenValid,
    attachCookiesToResponse
}