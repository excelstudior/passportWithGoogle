const router=require('express').Router();
const passport=require('passport');
const {OAuth2Client}=require('google-auth-library')
const localStorage=require('localStorage');
const bcrypt=require('bcryptjs');

//import model 
const User=require('../models/user');

//auth login
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/failLogin',(req,res)=>{
    res.render('failLogin')
})

//auth logout
router.get('/logout',(req,res)=>{
    req.session=null;
    let oAuth2Client=new OAuth2Client;
    oAuth2Client.revokeToken(localStorage.getItem('googleAccessToken'))
    res.redirect('/auth/login/')
})

//Register User
router.get('/register',(req,res)=>{
   res.render('register')

})

router.post('/register',(req,res)=>{
    //To do: Input validations, validate user existence

    let newUser=new User({
        username:req.body.username,
        password:'',
        googleId:'',
        thumbnail:'',
    })
        bcrypt.hash(newUser.password,5,(err,hash)=>{
            if(err){console.log(err)};
            newUser.password=hash;
            newUser.save()
                    .then(()=>res.redirect('/auth/login'))
                    .catch(err=>console.log(err))
        })
    
})

//user login use local strategy
router.post('/login',
passport.authenticate('local',{successRedirect:'/profile',failureRedirect:'/auth/failLogin',failureFlash: true}))


//user login use google strategy
router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    console.log(req.user)
    res.redirect('/profile')
})

module.exports=router;