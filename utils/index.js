const { createJwt, isTokenValid, attachCookiesToResponse} = require('./jwt')
const createTokenUser = require('./create-token')
const checkPermission = require('./check-permission')
const sendVerificationEmail = require('./sendEmailVerification')

module.exports ={
    createJwt,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermission,
    sendVerificationEmail
}