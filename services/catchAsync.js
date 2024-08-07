//catch async errors

module.exports = (fn)=>{
    return(req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            return res.status(400).json({
                message : "Something went worng"
            })
        })
    }
}