const router=require('express').Router();
const userUtil=require('../Utilities/user');
router.get('/',userUtil.isAuthenticated,(req,res)=>{
   res.render('profile',{user:req.user})
});
module.exports=router;