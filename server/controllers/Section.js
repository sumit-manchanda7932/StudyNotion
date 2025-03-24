const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory"
            })
        }
        //create section
        const newSection = (await Section.create({ sectionName }))

        //update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate({ _id:courseId }, { $push: { courseContent: newSection._id } }, { new: true })

        //return response
        return res.status(200).json({
            success: true,
            message: "section added successfully",
            updatedCourseDetails
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


exports.updateSection = async (req, res) => {
    try {
        //data input
        const { sectionName, sectionId } = req.body;

        //validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory"
            })
        }

        //update data
        const section = await Section.findByIdAndUpdate({_id: sectionId }, {
            sectionName,
        }, { new: true })



        //return response
        return res.status(200).json({
            success: true,
            message: "section updated successfully",
            section
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in updating section",
            error: error.message
        })
    }
}



exports.deleteSection = async (req, res) => {
    try {
        //get id  - assuming that we are sending Id in params
        const { sectionId } = req.body;
        //validation
        if (!sectionId) {
            return res.status(500).json({
                success: false,
                message: "missing parameter"
            })
        }

        //find by id and delete

        await Section.findByIdAndDelete(sectionId);


        //return response
        return res.status(200).json({
            success: true,
            message: "section deleted successfully"
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in deleting section",
            error: error.message
        })
    }
}