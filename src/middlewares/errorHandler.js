import { TIPOS_ERROR } from "../errors/errors.js";

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case TIPOS_ERROR.AUTHENTICATION || TIPOS_ERROR.AUTHORIZATION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: 'Credenciales incorrectas' });

        case TIPOS_ERROR.INVALID_ARGUMENT:
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: error.message });

        case TIPOS_ERROR.PRODUCT_NOT_FOUND || TIPOS_ERROR.CART_NOT_FOUND:
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: error.message });

        default:
            res.setHeader('Content-Type', 'application/json');
            console.error('Error:', error.message);
            if (error.message === 'jwt expired') {
                return res.render('new-login');
            }
            return res.status(500).json({ error: 'Error - contacte al administrador' });
    }
};