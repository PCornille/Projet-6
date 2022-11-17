const mongoose=require('mongoose');

const SauceSchema=mongoose.Schema({
  name:{type:String,required:true,unique:true},
  manufacturer:{type:String,required:true},
  description:{type:String,required:true},
  heat:{type:Number,required:true},
  likes:{type:Number,default:0},
  dislikes:{type:Number,default:0},
  imageUrl:{type:String,required:true},
  mainPepper:{type:String,required:true},
  usersLiked:{type:[String]},//ids
  usersDisliked:{type:[String]},
  userId:{type:String,required:true}
});

module.exports=mongoose.model('Sauce',SauceSchema);
