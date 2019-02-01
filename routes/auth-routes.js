const router = require('express').Router();
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library')
const localStorage = require('localStorage');
const bcrypt = require('bcryptjs');

//import model 
const User = require('../models/user');

//auth login
router.get('/login', (req, res) => {
    //console.log(req.flash('error'))
    res.render('login',{user:req.user,message:req.flash('error')})
})
router.get('/failLogin', (req, res) => {
    //console.log(req.flash('error'))
    res.render('failLogin',{ message: req.flash('error')})
})

//auth logout
router.get('/logout', (req, res) => {

    //
    let oAuth2Client = new OAuth2Client;
    let googleAccessToken = localStorage.getItem('googleAccessToken')
    if (googleAccessToken !== null) {
        oAuth2Client.revokeToken(googleAccessToken)
                    .then(()=>console.log('revoke google token'))
    }
    req.logOut();
    req.session=null;
    res.redirect('/auth/login/')
})

//Register User, guest register
router.get('/register', (req, res) => {
    res.render('register',{user:req.user})

})

router.post('/register', (req, res) => {
    let error={messages:[]};
    User.findOne({username:req.body.username}).then((user)=>{
        if(user){
            error.messages=['User name has been registered, Please user anther name.']
            res.send(error);
        } else {
            let phone={}
            phone.Type='Preferred';
            phone.numbers=req.body.phoneNumber;
            let userType=req.body.userType;
            let newUser = new User({
                username: req.body.username,
                password: req.body.password,
                firstName:req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone:[phone],
                googleId: '',
                thumbnail: '',
                createdBy: req.user!==undefined? user.id:req.body.username,
                userType:userType,
            })
            bcrypt.hash(newUser.password, 5, (err, hash) => {
                if (err) { console.log(err) };
                newUser.password = hash;
                newUser.save()
                    .then(() => res.redirect('/auth/login'))
                    .catch(err => console.log(err))
            })
        }
    }) 

    

})

//Register User by super admin

// router.get('/registerBySa',(req,res)=>{
//     res.render('registerBySa',{user:req.user})
// })

//user login use local strategy
router.post('/login',
    passport.authenticate('local', { successRedirect: '/ticket/LoggedInUserTickets/',failureRedirect:'/auth/login', failureFlash: true }))


//user login use google strategy
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log(req.user)
    res.redirect('/ticket/LoggedInUserTickets/')
})

module.exports = router;