const Course = require("../models/Course");
const Category = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config();
const { convertSecondsToDuration}= require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress")

//create course handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag ,category} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
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
        const categoryDetails = await Category.findById(category);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "category details not found",
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
            category: categoryDetails._id,
            tag: tag,
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


            await Category.findByIdAndUpdate(
                { _id: category },
                {
                    $push: {
                        courses: newCourse._id,
                    },
                },
                { new: true }
            );

        
        //return response
        return res.status(200).json({
            success: true,
            message: "course created successfully",
            newCourse
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
        const courseDetails = await Course.find({ _id: courseId })
        // .populate({
        //     path: "instructor",
        //     populate: {
        //         path: "additonalDetails",
        //     }

        // })
        .populate("category")//.populate("ratingAndreviews")
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
        success:"false",
        message:error.message,
      })
    }
}






// Function to get all courses of a particular instructor
exports.getInstructorCourses = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Find all courses of the instructor
		const allCourses = await Course.find({ instructor: userId });

		// Return all courses of the instructor
		res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		// Handle any errors that occur during the fetching of the courses
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});
	}
}




exports.getFullCourseDetails = async (req, res) => {
    try {
      console.log("REQ.BODY:", req.body);
      console.log("REQ.USER:", req.user); // this comes from auth middleware
  
      const { courseId } = req.body;
      const userId = req.user.id;
  
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
  
      console.log("COURSE DETAILS:", courseDetails);
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        });
      }
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userID: userId,
      });
  
      console.log("Course Progress:", courseProgressCount);
  
      let totalDurationInSeconds = 0;
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration);
          totalDurationInSeconds += timeDurationInSeconds;
        });
      });
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos ?? ["none"],
        },
      });
    } catch (error) {
      console.log("ERROR IN getFullCourseDetails:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  