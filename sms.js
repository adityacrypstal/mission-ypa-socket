const axios = require('axios');


class SmsService {
    static async TextMessage(number, body) {
        try {
            return await axios.get(process.env.SMS_URL, {
                params: {
                    username: process.env.SMS_USERNAME,
                    senderid: process.env.SMS_SENDER_ID,
                    password: process.env.SMS_PASSWORD,
                    to: number,
                    text: body,
                    datetime: new Date()
                }
            });
        } catch (e) {
            console.log(e)
        }
    }

    static async BulkMessage(numbers, body) {
        try {
            return await axios.get(process.env.SMS_URL, {
                params: {
                    username: process.env.SMS_USERNAME,
                    senderid: process.env.SMS_SENDER_ID,
                    password: process.env.SMS_PASSWORD,
                    to: numbers.join(':'),
                    text: body,
                    datetime: new Date()
                }
            });
        } catch (e) {
            console.log(e)
        }
    }

    static async UnicodeMessage(number, body) {
        try {
            return await axios.get(process.env.SMS_URL, {
                params: {
                    username: process.env.SMS_USERNAME,
                    senderid: process.env.SMS_SENDER_ID,
                    password: process.env.SMS_PASSWORD,
                    to: numbers.join(':'),
                    text: body,
                    type:'unicode',
                    datetime: new Date()
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = SmsService;
