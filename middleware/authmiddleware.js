import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <TOKEN>"
    
    if (!token) {
        return res.status(401).json({ msg: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.user || !decoded.user.id) {
            return res.status(401).json({ msg: 'Token is invalid' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;
