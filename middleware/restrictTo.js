const restrictTo = (...roles)=>{
   return (req,res,next)=>{
    const userRole = req.user.role
    if(!roles.includes(userRole)){
        res.status(404).json({
            message : "You don't have persmission to do this"
        })
    }else {
        next()
    }
   }

}



module.exports = restrictTo