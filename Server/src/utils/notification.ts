import nodemailer from 'nodemailer'
import twilio from 'twilio';
import ck from 'ckey'
import { logger } from './logger';


// transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ck.SMTP_USER, // Gmail address
    pass: ck.SMTP_PASSWORD,   // App Password
  },
});


export const sendEmailNotification = async (to, subject, text) => {
    // Email options
    const mailOptions = {
        from: `"Library Management System" <${ck.SMTP_USER}>`, // Sender address
        to: to, // Recipient(s)
        subject: subject, // Subject line
        text: text, // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        logger('email-notification').error(`Error sending email:`, error)
    } else {
        logger('email-notification').info(`'Email sent:', ${info.response}`)
    }
    });  
}



// sms notification
const accountSid = ck.TWILLIO_ACCT_SID;
const authToken = ck.TWILLIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


export const sendSmsNotification = async (body, to) => {
    client.messages
        .create({
            body: body,
            messagingServiceSid: ck.TWILLIO_MSG_SID,
            to: to
        })
        .then(message => logger('sms-notification').info(message.sid));
}

