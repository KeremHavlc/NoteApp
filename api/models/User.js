const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name:{type:String,require:true},
        surname:{type:String,require:true},
        username:{type:String, require:true},
        email:{type:String,require:true},
        password:{type:String,require:true},
        verify:{type:Boolean,require:true},
    },
    {timestamps:true}
)

const User = mongoose.model("users",userSchema);
module.exports = User;