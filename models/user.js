const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const userType=require('../Utilities/constants')
const Schema=mongoose.Schema;
const options={
    timestamps:true,
}
const userSchema=new Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    firstName:{type:String,default:''},
    lastName:{type:String,default:''},
    email:{type:String,trim:true,default:''},
    phone:[{numbers:String,numberType:String}],
    userType:{type:String,enum:[userType.ADMIN,userType.END_USER],default:userType.END_USER},
    accountExpireDate:{type:Date,default:null},
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