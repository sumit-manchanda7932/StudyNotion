const nodemailer=require("nodemailer")
require("dotenv").config();

const mailSender=async(email, title, body)=>{
     try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_User,
                pass:process.env.MAIL_PASS,
            }
          

        })

        let info=await transporter.sendMail({
            from:"StudyNotion || sumit_manchanda",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })

        console.log(info);
        return info;
     }
     catch(error) {
         console.log(error.message);

     }
}


module.exports=mailSender