const sendEmail = require('./sendEmail')

const sendVerificationEmail = async({name,email, verificationToken,origin})=>{

    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    return sendEmail({
        to:email,
        subject:'Email Confirmation',
        html:`<h1>verificationToken <a href=${verifyEmail}/> </h1>`
    })
}

module.exports = sendVerificationEmail;