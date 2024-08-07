const multer = require("multer")


const storage = multer.diskStorage({
    //destination =>matlab ka lagera halne bhneko tala ko code anusar upload bhnne folder ma lager hal bhneko
    destination : function(req,file,cb){
        //check the mimetype of the file
        const allowedFileType = [ 'image/png', 'image/jpg', 'image/jpeg' ]
        if(!allowedFileType.includes(file.mimetype)){
            cb(new Error ("this file type is not supported"))
            return
        }
        cb(null, "./uploads") //cb(error , success) cb(euta matra argument)
    },
    //filename=>matlab filename chai k rakhney bhneko file.originalName le chai file ma ako original name rakh bhneko
    filename : function(req,file,cb){
        cb(null,Date.now() + "-" + file.originalname)
    }
})

module.exports = {
    multer,
    storage
}