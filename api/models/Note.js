const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
    {
        title:{type:String,require:true},
        level:{type:String,require:true},
        author:{type:String,require:true},
        description:{type:String,require:true},
        userId : {type:String , require:true},
        priority : {type:String , require:true},
        isPrivate:{type:Boolean,require:true,default:false},
        status:{type:String,require:true,default:false},
        password:{type:String,required:function(){
            return this.isPrivate;
        }}
    },
    {timestamps:true}
)
const Note = mongoose.model("note" ,noteSchema);
module.exports= Note;