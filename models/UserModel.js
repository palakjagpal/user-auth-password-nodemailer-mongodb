import mongoose from "mongoose"

const UserEmailSchema = new mongoose.Schema({
    name: {type : String, required : true},
    email : { type: String, required : true},
    password : { type : String, required : true},
    resetToken : { type : String}
})

const UserEmailModel = mongoose.model("UserEmailModel", UserEmailSchema)

export default UserEmailModel