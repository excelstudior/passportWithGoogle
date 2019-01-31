const isAuthenticated = (req, res, next) => {
    if(req.user===undefined||req.user===null){
        
        res.redirect('/auth/login')
    } else{
        next()
    }
}
module.exports = { isAuthenticated }