const  {getSocket} = require("./utils");

const {createClient} = require("redis");

const pubClient = createClient();
const subClient = pubClient.duplicate();
const smsService = require('./sms');
const emailService = require('./email');
const notificationService = require('./notification');
const SMS_TEMPLATE = require('./smsTemplates');
const ejs = require('ejs');

subClient.on('connect', () => console.log('Connected to Redis!'));

subClient.connect();

subClient.subscribe('notifications', async (message) => {
    let {body: data = {}} = JSON.parse(message || {});
    if (!data.userId && !data.eventType) return;
    let template, smsBody;
    switch (data.eventType) {
        case 'ADD_EMPLOYEE':
            template = await ejs.renderFile('templates/verify-mail.ejs', {email: data.email, link: data.link});
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            await emailService.sendEmail(data.email, template, 'Welcome to YPA Admin!');
            break;
        case 'FORGOT_PASSWORD':
            template = await ejs.renderFile('templates/otp-mail.ejs', {email: data.email, otp: data.otp});
            await emailService.sendEmail(data.email, template, "Reset Your Password!");
            break;
        case 'PROJECT_ASSIGNED':
            template = await ejs.renderFile('templates/project-assigned.ejs', {
                email: data.user?.email,
                projectName: data.project?.name
            });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            await emailService.sendEmail(data.user?.email, template,"Project Assigned!");
            break;
        case 'STATUS_CHANGE':
            template = await ejs.renderFile('templates/status-change.ejs', {
                email: data.user?.email,
                from: data.from || "",
                to: data.to || "",
                project: data.project?.name
            });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            await emailService.sendEmail(data.user?.email, template, "Project Updated");
            break;
        case 'STATUS_CHANGE_TASK':
            // template = await ejs.renderFile('templates/status-change-task.ejs', {
            //     email: data.email,
            //     from: data.from,
            //     to: data.to,
            //     task: data.task.name,
            //     project: data.project?.name
            // });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            // await emailService.sendEmail(data.email, template);
            break;
        case 'CHANNEL_TRANSITION':
            // template = await ejs.renderFile('templates/channel-change.ejs', {
            //     email: data.email,
            //     from: data.from,
            //     to: data.to,
            //     project: data.project?.name
            // });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            // await emailService.sendEmail(data.email, template);
            break;
        case 'PROJECT_COMPLETION':
            // template = await ejs.renderFile('templates/project-completed.ejs', {
            //     email: data.email,
            //     project: data.project.name
            // });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // console.log(template, smsBody);
            // await smsService.TextMessage(data.phone, smsBody);
            // await emailService.sendEmail(data.email, template);
            break;
        case 'TASK_NO_RESPONSE':
            // template = await ejs.renderFile('templates/task-no-response.ejs', {
            //     email: data.email,
            //     task: data.task.name
            // });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            // await emailService.sendEmail(data.email, template);
            break;
        case 'CHANNEL_NO_RESPONSE':
            // template = await ejs.renderFile('templates/channel-no-response.ejs', {
            //     email: data.email,
            //     project: data.project.name,
            //     channel: data.channel.name
            // });
            // smsBody = SMS_TEMPLATE[data.eventType];
            // await smsService.TextMessage(data.phone, smsBody);
            // await emailService.sendEmail(data.email, template);
            break;


        default:
    }
});

subClient.subscribe('chat', (message) => {
    let {body:data={}} = JSON.parse(message || {});
    if (!data.projectId) return;
    const socket = getSocket();
    socket &&
    socket.emit('chat', { data });
});
