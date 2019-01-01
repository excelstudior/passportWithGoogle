const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const Schema=mongoose.Schema;
const options={
    timestamps:true,
}
const userSchema=new Schema({
    username:{type:String,unique:true,required:true},
    password:String,
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,trim:true},
    userType:{type:String,enum:[ADMIN,END_USER],default:END_USER},
    accountExpireDate:{type:Date},
    activeStatus:{type:Boolean,default:true},
    googleId:String,
    thumbnail:String,
},options)

userSchema.methods.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
userSchema.methods.updatePassword=function(password){
    bcrypt.hash(password,5,(err,hash)=>{
        if(err){console.log(err)};
        this.password=hash;
        return this
    })
}

//get full name of user virtual method
userSchema.virtual('fullName').get(function(){
    return this.firstName+' '+this.lastName;
})
const User=mongoose.model('user',userSchema)
module.exports=User;