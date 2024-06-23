import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(
    {
        path: "./src/.env",
        override: true
    }
);

export const config = {
    PORT: process.env.PORT||8081,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_URL_COMPLETE: process.env.MONGO_URL_COMPLETE,
    DB_NAME: process.env.DB_NAME,
    SECRET:process.env.SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'laueze1998@gmail.com',
        pass: 'lmmu wgwx jtfs tvqk'
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