import nodemailer from 'nodemailer';

export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST ||'smtp.gmail.com' || 'gmail',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false, 
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