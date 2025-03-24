const express = require("express")
const app = express();
require("dotenv").config();

const userRoutes= require("./routes/User");
const profileRoutes= require("./routes/Profile");
// const paymentRoutes= require("./routes/Payments");
const courseRoutes= require("./routes/Course");

const dbConnect= require("./config/database");
const cookieParser= require("cookie-parser");
const cors = require("cors");
const {cloudinaryconnect}= require("./config/cloudinary")
const fileUpload = require("express-fileupload");

const PORT=process.env.PORT || 4000;

dbConnect();
cloudinaryconnect()

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

app.use(
    fileUpload({
       useTempFiles:true, 
       tempFileDir:"/tmp",
    })
)




app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
// app.use("/api/v1/payment",paymentRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success:"true",
        message:"your server is up and running..."
    })
})

app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`)
})
