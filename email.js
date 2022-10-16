const sgMail = require('@sendgrid/mail');
class EmailService {
    static async sendEmail(email, body, subject) {
        try {
            await sgMail.setApiKey(process.env.MAIL_API_KEY);
            const msg = {
                to: email, // Change to your recipient
                from: process.env.MAIL_FROM, // Change to your verified sender
                subject: subject,
                html: body,
            };
            await sgMail.send(msg);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = EmailService;
