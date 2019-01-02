const passport = require('passport');
const bcrypt=require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user');
const utilities=require('../Utilities/constants');
const localStorage=require('localStorage');

passport.serializeUser((user, done) => {
    done(null, user);
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
                password:utilities.randomeString(25),
                googleId: profile.id,
                thumbnail:profile._json.image.url,
                createdBy:'google'
            }).save().then((newUser) => {
                console.log('New user created: ' + newUser);
                done(null, newUser);
            })
        }
    })
}))

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true,
      },
    function(req,username, password, done) {
        console.log(req.body,username,password)
        User.findOne({ username: username }, function(err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
              console.log(password)
            return done(null, false, { message: 'Incorrect password.' });
          }  else {
            return done(null, user);
          }
         
        });
      }
))