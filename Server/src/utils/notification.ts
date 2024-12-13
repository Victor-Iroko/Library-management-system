import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import twilio from 'twilio';
dotenv.config()


// transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, // Gmail address
    pass: process.env.SMTP_PASSWORD,   // App Password
  },
});


export const sendEmailNotification = async (to, subject, text) => {
    // Email options
    const mailOptions = {
        from: `"Library Management System" <${process.env.SMTP_USER}>`, // Sender address
        to: to, // Recipient(s)
        subject: subject, // Subject line
        text: text, // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(`Error sending email:`, error);
    } else {
        console.log(`'Email sent:', ${info.response}`);
    }
    });  
}



// sms notification
const accountSid = process.env.TWILLIO_ACCT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


export const sendSmsNotification = async (body, to) => {
    client.messages
        .create({
            body: body,
            messagingServiceSid: process.env.TWILLIO_MSG_SID,
            to: to
        })
        .then(message => console.log(message.sid));
}

