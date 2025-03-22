const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema=new mongoose.Schema({
   email:{
    type:String,
    required:true,
   },
   createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
   },
   otp:{
    type:String,
    required:true,
   }

})


// a function to send emails

async function sendVerificationEmail()
{
     try{
        const mailResponse= await mailSender(email,"Verification Email", otp);
        console.log("Email sent Successfully",mailResponse)
     }
     catch(error) {
      console.log("error occured while sending email" ,error);
      throw error;
     }
}


otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email, this.otp);
})


module.exports=mongoose.model("OTP",otpSchema)