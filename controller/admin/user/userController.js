const User = require("../../../model/userModel")

exports.getUsers = async(req,res)=>{
    const userId = req.user.id
    const users = await User.find({_id : {$ne : userId}}).select(["+otp", "+isOtpVerified", "-__v"]) 
    //{_id : {$ne : userId}} yesle bhnexa ki malai tyo sab user haru show gar jun chai maile request gareko id ko haina or role ko haina means admin bahek aru customer haru show gar bhneko
    //id ko value jasko user.id bhnera cha tesko bahek jammai ko data dey
    //jasle request gareko usko bahek jammai ko dey  
    if(users.length > 1 ){
        res.status(201).json({
            message : "Users fetched successfully",
            data : users
        })
    }else{
        res.status(404).json({
            message : "Users not found",
            data: []
        })
    }
}

//delete user API
exports.deleteUser = async(req,res)=>{
    const userId = req.params.id
    if(!userId){
        return res.status(400).json({
            message : "Please provide user Id"
        })
    }
//check if that provided userId exists or not
const user = await User.findById(userId)
if(!user){
    res.status(400).json({
        message : "User with that id not found"
    })
}else { 
    await User.findByIdAndDelete(userId)
    res.status(200).json({
        message : "User Deleted successfully",
        data : user
    })
}
}