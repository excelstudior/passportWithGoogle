const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');
const localStorage=require('localStorage');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        //need to cover user not found
        done(null, user);
    })

});

passport.use(new GoogleStrategy({
    //options for strategy 
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
}, (accessToken, refreshToken, profile, done) => {
    localStorage.setItem('googleAccessToken',accessToken);
    // console.log(profile,'accessToken is ',accessToken,'refreshToken is ',refreshToken,'done is ',done)
    User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
            console.log(existingUser.username + ' found.')
            done(null, existingUser);
        } else {
            new User({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail:profile._json.image.url
            }).save().then((newUser) => {
                console.log('New user created: ' + newUser);
                done(null, newUser);
            })
        }
    })
}))