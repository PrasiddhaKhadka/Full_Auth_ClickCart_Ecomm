const sendEmail = require('./sendEmail')

const sendVerificationEmail = async({name,email, verificationToken,origin})=>{
    return sendEmail({
        to:email,
        subject:'Email Confirmation',
        html:`<h1>verificationToken ${verificationToken}</h1>`
    })
}

module.exports = sendVerificationEmail;