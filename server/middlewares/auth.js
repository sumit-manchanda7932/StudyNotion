const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "")

        //if token missing, then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        //verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            })
        }

        next()

    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "something went wrong while validating the token"
        })
    }
}



//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for students only"
            })
        }

        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role can't be verified"
        })
    }
}


//isAdmin



exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for admin only"
            })
        }

        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role can't be verified"
        })
    }
}


//isInsructor



exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for instructor only"
            })
        }

        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role can't be verified"
        })
    }
}

