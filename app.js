const express=require ('express');
const cookieSession=require('cookie-session');
const flash=require('connect-flash');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const app =express();
//const mongoose=require('mongoose');
const keys=require('./config/keys');
const passport=require('passport');
const passportSetup=require('./config/passport-setup');
const authRoutes=require('./routes/auth-routes');
const profileRoutes=require('./routes/profile')
const dbConnect=require('./Utilities/dbConnect');

app.set('view engine','ejs')
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

//connect to Mongodb
app.use(dbConnect.initDatabaseServer);

app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.use(function(req,res,next){
    
    console.log('req session is ',req.session);
    next()
})
app.get('/',(req,res)=>{
    res.render('home',{user:req.user})
})

app.listen(3000,()=>{
    console.log('app now listening for requests on port 3000')
})