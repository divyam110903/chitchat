import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token=req.cookies.jwt;
        if(!token)return res.status(401).json({message: 'Unauthorized access, please login first'});

        const decoded=jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: 'Unauthorized access, Invalid Token'});
        }

        const user=await User.findById(decoded.userid).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        req.user=user;;
        next();

    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}