const Profile = require("../models/Profile");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.updateProfile = async (req, res) => {
    try {

        const { gender, dob="", about="", contactNumber} = req.body;
        const id=req.user.id

        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "mandatory fields are required"
            })
        }

        const userDetails = await User.findById(id);
        const profileId= userDetails.additionalDetails;

        const profileDetails =await Profile.findById(profileId);


       profileDetails.dob=dob;
       profileDetails.gender=gender;
       profileDetails.about=about;
       profileDetails.contactNumber=contactNumber;

       await profileDetails.save();


        //return response
        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            profileDetails
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in updating profile",
            error: error.message
        })
    }
}


exports.deleteAccount = async (req, res) => {
     try{
       const id=req.user.id;
      
       const userDetails= await User.findById(id);

       if(!userDetails){
        return res.status(400).json({
            success: false,
            message: "user not found"
        })
       }


       const profileId =userDetails.additionalDetails;
       await Profile.findByIdAndDelete({_id:profileId});
       await User.findByIdAndDelete({_id:id});

       return res.status(200).json({
        success: true,
        message: "account deleted successfully",
    })

     }
     catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in deleting account",
            error: error.message
        })
    }
}


exports.getAllUserDetails =async(req,res)=>{
    try{
        const id=req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
             success:true,
             message:"user data fetched successfully",
             userDetails
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in fetching details",
            error: error.message
        })
    }
}



exports.updateDisplayPicture = async (req,res)=>{
    try{
         const id = req.user.id;

         const user =await User.findById(id);
         if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
         }

         const image = req.files.pfp;
         if(!image){
            return res.status(404).json({
                success: false,
                message: "Image not found",
            })
         }

         const uploadDetails = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME
         )

         const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{new:true})
         
        res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedImage,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getEnrolledCourses=async (req,res) => {
	try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const enrolledCourses = await User.findById(id).populate({
			path : "courses",
				populate : {
					path: "courseContent",
			}
		}
		).populate("courseProgress").exec();
        // console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}