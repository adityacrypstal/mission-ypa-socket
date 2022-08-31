// const sgMail = require('@sendgrid/mail');

class NotificationService {
    static async sendNotification(id, body) {
        // try {
        //     await sgMail.setApiKey(process.env.MAIL_API_KEY);
        //     const msg = {
        //         to: email, // Change to your recipient
        //         from: process.env.MAIL_FROM, // Change to your verified sender
        //         subject: 'Otp Confirmation',
        //         html: body,
        //     };
        //     await sgMail.send(msg);
        // } catch (e) {
        //     console.log(e.response.body);
        // }
    }
}

module.exports = NotificationService;
