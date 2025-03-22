const Course = require("../models/Course");
const Tag = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config();

//create course handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "fill all the fields"
            })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);


        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            })
        }


        //check tag is valid or not 
        const tagDetails = await Tag.findById(tag);

        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "tag details not found",
            })
        }


        //upload to cloudinary

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course


        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })


        //add the new course to the user schemas of instructor
        await User.findByIdAndUpdate({
            _id: instructorDetails._id
        },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true })


        //update the Tag ka schema

        //return response
        return res.status(200).json({
            success: true,
            message: "course created successfully"
        })





    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in creating the course"
        })

    }
}


//get all courses handler function

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({})// { courseName: true, price: true, thumbnail: true, instructor: true, ratingAndReviews: true, studentsEnrolled: true }).populate("instructor").exec();
        res.status(200).json({
            success: true,
            message: "all courses returned successfully"
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in fetching all courses"
        })

    }
}

//get Course Details 

exports.getCourseDetails = async (req, res) => {
    try {
        //get id
        const { courseId } = req.body;
        // find course details 
        const courseDetails = await Course.find({ _id: courseId }).populate({
            path: "instructor",
            populate: {
                path: "additonalDetails",
            }

        }).populate("category").populate("ratingAndreviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                }
            })
            .exec();

            //validation
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:`could not find the course with ${courseId}`
                })
            }

            return res.status(200).json({
                success:true,
                message:"course details fetched successfully",
                data:courseDetails,
            })

    }
    catch (error) {
      console.log(error);
      return res.status(400).json({
        success:"true",
        message:error.message,
      })
    }
}





