import nodemailer from 'nodemailer';

export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    const transporter = nodemailer.createTransport({
        service: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: `YLink Tech <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    });
};