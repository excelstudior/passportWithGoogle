const router=require('express').Router();
const passport=require('passport');
const {OAuth2Client}=require('google-auth-library')
const localStorage=require('localStorage');
//auth login
router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/logout',(req,res)=>{
    // req.logout();
    req.session=null;
    let oAuth2Client=new OAuth2Client;
    oAuth2Client.revokeToken(localStorage.getItem('googleAccessToken'))
    res.redirect('/auth/login/')
    
    //res.send('logging out')
})

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    console.log(req.user)
    res.redirect('/profile/')
})

module.exports=router;