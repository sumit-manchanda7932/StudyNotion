const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create rating 

exports.createRating = async (req, res) => {
    try {
        //fetch data from req body
        const { rating, review, courseId } = req.body;
        //fetch id 
        const userId = req.user._id;
        //check if user is enrolled or not 
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $eleMatch: { $eq: userId } }
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "student is not enrolled in this course"
            })
        }
        //check if user already review 
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        })

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: " course is already reviewed by the user"
            })
        }

        //create review 

        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        })

        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: courseId }, {
            $push: {
                ratingAndReviews: ratingReview._id,
            }
        }, { new: true })

        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "rating and review done successfully",
            ratingReview,
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get average rating

exports.getAverageRating = async (req, res) => {
    try {
        //get course id 
        const { courseId } = req.body;
        //calculate average rating
        const result = await RatingAndReview.aggregate([{
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $group: {
                _id: null,
                averageRating: {
                    $avg: "$rating"
                }
            }
        }])
        // return rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        return res.status(200).json({
            success: true,
            message: "average rating is 0, no ratings given till now",
            averageRating: 0
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//get all rating

exports.getAllRating = async (req, res) => {
    try { 
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courstName",
        })
        .exec()

        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews,
        })
        
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


