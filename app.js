import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import UserRoute from "./routes/UserRoute.js"

dotenv.config()

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected !"))
.catch((error) => console.log("MongoDB connection error :", error))

app.use("/api/users", UserRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})