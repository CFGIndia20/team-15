const nodemailer = require('nodemailer');
async function main(email,output){
let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'drishtibeohar2509@gmail.com',
        pass:'codeforgood'
    }
    
});

// send mail with defined transport object
return  transporter.sendMail({
    from: "drishtibeohar2509@gmail.com",
    to: "nayansinghai66@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello let me know if you recive the email"+ email, // plain text body
  });

  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

 
}

module.exports = main;