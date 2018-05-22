const user = require('../models/user');
const nodemailer = require('nodemailer');

module.exports = {
  sendNotif(req, res) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADD,
        pass: process.env.EMAIL_PASS
      }
    });
  
    user.find({})
    .then(function(userData){
      userData.forEach(user => {
        var mailOptions = {
          from: process.env.EMAIL_ADD,
          to: user.username,
          subject: 'Comback Notification',
          text: 'Check back with us to find out what has been happening!'
        }
      })
    })
    .catch(function(err){
      console.log(err)
    })
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }
}


