const SubSection = require("../models/SubSection")
const Section = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()

exports.createSubSection = async (req, res) => {
    try {
        //fetch data
        const { title, timeDuration, description, sectionId } = req.body;
        const { video } = req.files.videoFile
        //validation
        if (!title || !timeDuration || !description || !video || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory"
            })
        }

        //upload to cloudinary
        const uploadDetails = uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // entry in db
        const SubSectionDetails = await SubSectionDetails.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId }, {
            $push: {
                subSection: SubSectionDetails._id
            }
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "section added successfully",
            updatedSection
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in adding section",
            error: error.message
        })
    }
}