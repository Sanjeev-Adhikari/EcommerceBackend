

//controller-logics below

const User = require("../../../model/userModel")
const bcrypt = require("bcryptjs")
//get my profile
exports.getMyprofile = async(req,res)=>{
    const userId = req.user.id
    const myProfile = await User.findById(userId)

    //send response
    res.status(200).json({
        data : myProfile,
        message : "Profile fetched successfully"
    })
}


//update my profile
exports.updateMyProfile = async (req,res)=>{
    const {userName, userEmail, userPhoneNumber} = req.body
    const userId = req.user.id
    //update profile
    const updatedData = await User.findByIdAndUpdate(userId,{userName, userEmail, userPhoneNumber},{
        runValidators :true //update hunu aghi schema ma jati ota validators cha sab run garxa
    })
    res.status(200).json({
        message : "Profile updated successfully",
        data : updatedData
    })

}


//delete my profile
exports.deleteMyProfile = async (req,res)=>{
    const userId = res.user.Id
    await User.findByIdAndDelete(userId)
    res.status(200).json({
        message : "Profile deleted successfully",
        data : null
    })
}

//update my password
exports.updateMyPassword = async(req,res)=>{
    const userId = req.user.Id
    const {oldPassword, newPassword, confirmNewPassword} = req.body
    if(!oldPassword || !newPassword || !confirmNewPassword){
        return res.status(400).json({
            message : "Please provide the required fields"
        })
    }
    if(newPassword !== confirmNewPassword){
        return res.status(400).json({
            message :  "newPassword and confirmNewPassword didn't match"
        })
    }

    //taking out the hash of the oldPassword
    const userData = await User.findById(userId)
    const hashedOldPassword = userData.userPassword

    //check if oldPassword is correct or not
    const isOldPasswordCorrect = bcrypt.compareSync(oldPassword, hashedOldPassword)
    if(!isOldPasswordCorrect){
        return res.status(400).json({
            message : "OldPassword did not match"
        })
    }
    //match bhayo bhne
    userData.userPassword = bcrypt.hashSync(newPassword,12)
    await userData.save()
    //send response
    res.status(200).json({
        message : "Password Changed successfully"
    })
}