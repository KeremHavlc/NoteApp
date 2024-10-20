const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req,res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer','');
    if(!token){
        return res.status(401).json({message:"Token Bulunamadı Lütfen Giriş Yap!"});
    }
    try {
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({message:"Geçersiz Token"});
    }
}

module.exports = authMiddleware;