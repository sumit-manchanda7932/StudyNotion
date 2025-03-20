const User = require("../models/User")
const mailSender = require("../utils/mailSender")


//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req body
        const email = req.body.email
        // check user for this email ,email verification
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "fill email"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not registered with this email"
            })
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by adding token and expiration tim
        const updatedDetails = await User.findOneAndUpdate({ email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        }, { new: true });

        //create url
        const url = `https://localhost:3000/update-password/${token}`

        //send mail containing ther url

        await mailSender(email, "Password Reset Link", `Password reset link ${url}`)


        //return response
        return res.json({
            success: true,
            message: "email sent successfully"
        })



    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "error in sending email"
        })
    }

}


//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { token, password, confirmPassword } = req.body;
        //validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "password not matching"
            })
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({ token: token });

        //if no entry - invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "token invalid"
            })
        }

        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "token is expired"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password
        await User.findOneAndUpdate({ token: token }, { password: hashedPassword }, { new: true })
        //return response
        return res.status(200).json({
            success: true,
            message: "password reseted successfully"
        })



    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "error in reseting the password"
        })
    }
}




