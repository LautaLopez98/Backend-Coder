import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import { config } from "./config/config.js";

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'laueze1998@gmail.com',
        pass: config.GMAIL_PASS
    }
});

export const sendWelcomeEmail = (toEmail) => {
    const mailOptions = {
        from: 'laueze1998@gmail.com',
        to: toEmail,
        subject: 'Bienvenido a mi aplicación',
        text: 'Gracias por registrarte en mi aplicación!',
        html: '<h1>Bienvenido!</h1><p>Gracias por registrarte en mi aplicación!</p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};

export const sendResetPasswordEmail = (toEmail, token) => {
    const mailOptions = {
        from: 'laueze1998@gmail.com',
        to: toEmail,
        subject: 'Restablecimiento de Contraseña',
        html: `<h1>Restablecimiento de Contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="http://localhost:8080/resetpassword/${token}">Restablecer Contraseña</a>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error enviando el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};