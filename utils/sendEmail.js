const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodeMailerConfig')

const sendEmail = async({to,subject,html})=>{
    const account = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport(nodemailerConfig);

   return await transporter.sendMail({
    from: '"Click And Cart" <maddison53@ethereal.email>', //sender address
    to,
    subject,
    html
  });
}


module.exports = sendEmail;
