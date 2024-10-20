const User = require('../models/User');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt  = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/* Register İşlemi */
router.post("/register", async (req, res) => {
    try {
        const {name, surname, username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, surname, username, email, password: hashedPassword});
        await newUser.save();  

        const token = jwt.sign({userId: newUser._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
        res.status(201).json({token});
    } catch (error) {
        res.status(500).json(error);
    }
});

/* Login İşlemi */
router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});  
       
        if (!user) {
            return res.status(400).json({message: "Kullanıcı Bulunamadı!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Yanlış Şifre"});
        }

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
