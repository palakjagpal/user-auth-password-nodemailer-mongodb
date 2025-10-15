import UserEmailModel from "../models/UserModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js"

/************************************************************ */
//Register User Controller
//This controller handles user registration, including checking for existing users, hashing passwords, creating new user records, and sending a welcome email.  
export const RegisterUser = async(req,res) => {
    try{
        const { name, email, password } = req.body
        console.log(req.body)

        const existingUser = await UserEmailModel.findOne({email})
        if(existingUser) return res.status(400).json({msg : "User is already registered!"})

        const hashed = await bcrypt.hash(password, 10)
        const user = await UserEmailModel.create({ name, email, password : hashed})

        const html = `<h2>Welcome to Our App</h2>
        <p>Thank you ! for registering with us </p>`

        await sendEmail(email, "Welcome to Our App", html)

        res.status(201).json({msg : "User Registered Successfully ! , user"})
    }catch(error){
        res.status(500).json({error : error.message})
    }
}


/******************************************************** */
//Forgot Password Controller
//This controller handles the process of sending a password reset link to the user's email.
//It generates a JWT token, saves it to the user's record, and sends an email with the reset link.

export const forgotPassword = async(req,res) => {
    const { email } = req.body
    const user = await UserEmailModel.findOne({email})

    if(!user) return res.status(404).json({message : "User does not exist !"})

    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, { expiresIn : "1h"})

    user.resetToken = token
    await user.save()

    const resetLink = `http://localhost:8000/api/users/reset-password/${token}`

    const html = `<h2>Password Reset Link</h2>
    <p>Hello ${user.name}</p>
    <p> Click ${resetLink} to reset your password. This link will expire in 1 hour</p>
    <p><i>If you did not request a password reset, please ignore this email.</i></p>`

    await sendEmail(email, "Password Reset Request", html)
    res.status(200).json({message : "Password reset link has been sent to your email."})
}


/******************************************************** */
//Reset Password Controller
//This controller handles the password reset process. It verifies the JWT token, hashes the new password, updates the user's record, and clears the reset token.
// It ensures that the token is valid and has not expired before allowing the password change.
// It also provides appropriate responses for success and error scenarios.

export const ResetPassword = async(req,res) => {
    try{
        const { token } = req.params
        const {newPassword} = req.body
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserEmailModel.findById(decoded.id)

        if(!user) return res.status(404).json({message : "User does not exist !"})

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetToken = null
        await user.save()

        res.json({message : "Password has been reset successfully !"})
    }catch(error){
        res.status(400).json({message : "Invalid or expired token !"})
    }
}
