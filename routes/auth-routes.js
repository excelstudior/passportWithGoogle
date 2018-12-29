const router=require('express').Router();
const passport=require('passport');
//auth login
router.get('/login',(req,res)=>{
    res.render('login',)
})

router.get('/logout',(req,res)=>{
    req.logout();
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