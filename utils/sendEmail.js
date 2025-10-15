import nodemailer from "nodemailer"

export const sendEmail = async(to, subject, html) =>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,      //your email id
            pass : process.env.EMAIL_PASS      //your email password
        }
    })

    await transporter.sendMail({
        from : `" Support Team " <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    })
}