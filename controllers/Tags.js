const Tag = require("../models/Tag");

//create tag ka handler function

exports.createTag = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //create entry in db
        const tagDetails = await Tag.create({
            name: name,
            description: description
        })
        console.log(tagDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "tag created successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "error in creating the tag"
        })
    }

}

//get all tags

exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "all tags returned successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "error in creating the tag"
        })
    }
}

exports.categoryPageDetails = async (req,res) => {
    try{
        //get categoryId 
        const {categoryId}=req.body;
        //get courses for category id
        const selectedCategory = await Tag.findById(categoryId)
                                          .populate("courses").exec();
        //validation
        if(!selectedCategory){
            return res.status(500).json({
                success:false,
                message:"data not found"
            })
        }
        //get course for different categories
        const differentCategory = await Tag.find({_id:{$ne:categoryId},}).populate("courses").exec();
        //get top selling courses

        //return response
        return res.status(200).json({
            success: true,
            data:{
                selectedCategory,
                differentCategory
            }
        })


    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "error in fetching the category page details"
        })
    }
    
}