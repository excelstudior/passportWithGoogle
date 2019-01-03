const router = require('express').Router();
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library')
const localStorage = require('localStorage');
const bcrypt = require('bcryptjs');

//import model 
const User = require('../models/user');

//auth login
router.get('/login', (req, res) => {
    res.render('login',{user:req.user})
})
router.get('/failLogin', (req, res) => {
    res.render('failLogin')
})

//auth logout
router.get('/logout', (req, res) => {

    req.logOut();
    let oAuth2Client = new OAuth2Client;
    let googleAccessToken = localStorage.getItem('googleAccessToken')
    if (googleAccessToken !== null) {
        oAuth2Client.revokeToken(googleAccessToken)
                    .then(()=>console.log('revoke google token'))
    }
    req.session=null;
    res.redirect('/auth/login/')
})

//Register User
router.get('/register', (req, res) => {
    res.render('register',{user:req.user})

})

router.post('/register', (req, res) => {
    //To do: Input validations, validate user existence

    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        googleId: '',
        thumbnail: '',
        createdBy: req.user!==undefined? user.id:req.body.username
    })
    bcrypt.hash(newUser.password, 5, (err, hash) => {
        if (err) { console.log(err) };
        newUser.password = hash;
        newUser.save()
            .then(() => res.redirect('/auth/login'))
            .catch(err => console.log(err))
    })

})

//user login use local strategy
router.post('/login',
    passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/auth/failLogin', failureFlash: true }))


//user login use google strategy
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log(req.user)
    res.redirect('/profile')
})

module.exports = router;