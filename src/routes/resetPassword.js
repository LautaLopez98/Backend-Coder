import {Router} from "express";
import { generateResetToken, verifyResetToken } from '../jwt.js';
import { usersModel } from "../dao/models/usersModel.js";
import { sendResetPasswordEmail } from '../nodemailer.js';
import { generaHash, validatePassword } from "../../utils.js";

export const router = Router();

router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;
    const user = await usersModel.findOne({ email });
    if (!user) {
        return res.status(400).send('Usuario no encontrado');
    }
    const token = generateResetToken(user._id);
    sendResetPasswordEmail(email, token);
    res.send('Correo de restablecimiento de contraseña enviado');
});

router.post('/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const payload = verifyResetToken(token);
    if (!payload) {
        req.logger.error('El enlace ha expirado o es inválido');
        return res.status(400).send('El enlace ha expirado. Por favor, solicitá un nuevo correo de restablecimiento de contraseña');
    }
    const user = await usersModel.findById(payload.id);
    if (!user) {
        req.logger.error('Usuario no encontrado');
        return res.status(404).send('Usuario no encontrado');
    }
    const isSamePassword = validatePassword(newPassword, user.password);
    if (isSamePassword) {
        return res.status(400).send('No podés usar la misma contraseña');
    }
    user.password = generaHash(newPassword);
    await user.save();
    req.logger.info('Contraseña actualizada con éxito');
    res.redirect('/login');
});
