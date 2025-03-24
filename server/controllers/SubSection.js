const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()
const mongoose = require("mongoose");

exports.createSubSection = async (req, res) => {
    try {
        //fetch data
        const { title, timeDuration, description, sectionId } = req.body;
        // const { video } = req.files.videoFile
        const video = req.files.videoFile;
        console.log(title,timeDuration,description,sectionId);
        //validation
        if (!title || !timeDuration || !description || !video || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory"
            })
        }



        //upload to cloudinary
        // const uploadDetails = uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log("Upload Details:", uploadDetails);

        // entry in db
        
        const SubSectionDetails = await SubSection.create({
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