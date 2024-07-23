import jwt from 'jsonwebtoken';
import { config } from './config/config.js';

export const generateResetToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, config.SECRET, { expiresIn: '1h' });
};

export const verifyResetToken = (token) => {
    try {
        return jwt.verify(token, config.SECRET);
    } catch (error) {
        return null;
    }
};