const User = require("./model/userModel")

const bcrypt = require("bcryptjs")

const adminSeeder = async ()=>{

    //ADMIN data-seeding

//check if the admin exists or not

const isAdminExists = await User.findOne({userEmail : "admin@gmail.com"})
if(!isAdminExists){
    await User.create({
        userEmail : "admin@gmail.com",
        userPassword : bcrypt.hashSync("admin", 10),
        userPhoneNumber : 9632587418,
        userName : "admin",
        role : "admin"
    })
    
    console.log("Admin seeded successfully")
}else{
    console.log("Admin seeded already")
}
}

module.exports = adminSeeder