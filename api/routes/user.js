const bcrypt = require("bcryptjs");
const User = require('../models/User');
const express = require('express');
const router = express.Router();
router.get("/get-all-user" , async (req,res)=>{
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get("/profileId/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı Bulunamadı!" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Sunucu Hatası" });
    }
});
router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı Bulunamadı!" });
    }
    res.status(200).json("Kullanıcı Başarıyla Silindi");
  } catch (error) {
    res.status(500).json({ error: "Sunucu Hatası" });
  }
});
router.put("/update-user/:userId" , async (req,res)=>{
  try {
  const updateUser = await User.findByIdAndUpdate({_id:req.params.userId} ,req.body);
  if(!updateUser){
    return res.status(404).json({message:"Kullanıcı Bulunamadı!"});
  }
  res.status(200).json({message:"Kullanıcı Başarıyla Güncellendi!"});
 } catch (error) {
  res.status(500).json({error:"Sunucu Hatası"});
 }
});
router.post("/verify-password" , async (req,res)=>{
  const {userId, password} = req.body;
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({message:"Kullanıcı Bulunamadı!"});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Şifre Hatalı!"});
    }
    res.json({message:"Şifre Doğru!"});
  } catch (error) {
      console.log("Şifre Doğrulama Hata");
      res.status(500).json({message:"Sunucu Hatası!"});
  }
});


module.exports = router;