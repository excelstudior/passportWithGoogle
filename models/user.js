const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    username:String,
    password:String,
    googleId:String,
    thumbnail:String,
})

userSchema.methods.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
const User=mongoose.model('user',userSchema)
module.exports=User;