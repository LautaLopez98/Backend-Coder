import { isValidObjectId } from 'mongoose';
import { usersModel } from '../dao/models/usersModel.js';
import { CustomError } from '../errors/customError.js';
import { TIPOS_ERROR } from '../errors/errors.js';
import 'express-async-errors';

export class UserController {
    static changeUserRole = async (req, res, next) => {
        let { uid } = req.params;
        if (!isValidObjectId(uid)) {
            return next(CustomError.createError('Error', null, 'Ingrese un id válido de MongoDB como argumento para búsqueda', TIPOS_ERROR.INVALID_ARGUMENT));
        }
        try {
            const user = await usersModel.findById(uid);
            if (!user) {
                return next(CustomError.createError('UserNotFoundError', null, `Usuario con id ${uid} no encontrado`, TIPOS_ERROR.USER_NOT_FOUND));
            }
            user.rol = user.rol === 'user' ? 'premium' : 'user';
            await user.save();
            req.logger.info('Rol de usuario cambiado correctamente');
            res.json({ message: 'Rol de usuario cambiado correctamente', user });
        } catch (error) {
            req.logger.error(`Error al cambiar el rol del usuario con id ${uid}`, error);
            return next(error);
        }
    }
}