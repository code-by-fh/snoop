import logger from '#utils/logger.js';
import nodemailer from 'nodemailer';
import { accountActivationEmail } from './emailTemplates/accountActivation.js';
import { passwordResetEmail } from './emailTemplates/passwordReset.js';

let transporter;

if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
} else {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: Number(process.env.SMTP_PORT) || 1025,
        secure: false,
    });
}

export const sendEmail = async (to, subject, html) => {
    const message = {
        from: '"SNOOP" <no-reply@snoop.dev>',
        to,
        subject,
        html,
    };

    logger.debug(`[MAIL DEBUG] Sending email to ${to} with subject "${subject}"`);
    logger.debug(`[MAIL DEBUG] HTML length: ${html.length}`);

    const info = await transporter.sendMail(message);

    logger.debug(`[MAIL DEBUG] Message sent: ${info.messageId}`);
    if (process.env.NODE_ENV !== 'production') {
        logger.debug(`[MAIL DEBUG] Preview: http://localhost:8025`);
    }
};

export const sendActivationEmail = async (email, username, activationUrl) => {
    const html = accountActivationEmail(username, activationUrl);
    await sendEmail(email, 'Activate your SNOOP account', html);
};

export const sendResetEmail = async (to, resetUrl) => {
    const html = passwordResetEmail(to, resetUrl);
    await sendEmail(to, 'Password Reset Request', html);
};
