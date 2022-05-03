const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD
    }
});

module.exports = transporter;

// let options = {
//     from: process.env.GMAIL_ACCOUNT,
//     to: 'boterasuo@gmail.com',
//     subject: 'test email',
//     text: 'Hello boterasuo, this is nodemailer test email.'
// };

// transporter.sendMail(options, function(error, info) {
//     if (error) {
//         console.log('error', error);
//     } else {
//         console.log('訊息發送', info.response);
//     }
// });