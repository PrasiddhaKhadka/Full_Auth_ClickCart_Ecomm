const nodemailer = require('nodemailer')

const sendEmail = async()=>{
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kurt.stokes53@ethereal.email',
        pass: 'zGWz5aXf3mqujyPHa3'
    }
});

 let info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: "bar@example.com, baz@example.com",
    subject: "Hello ✔",
    text: "Hello world?", 
    html: "<b>Hello world?</b>", 
  });
}


module.exports = sendEmail;
