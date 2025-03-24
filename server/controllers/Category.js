const Category = require("../models/Category");

//create tag ka handler function

exports.createCategory = async (req, res) => {
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
        const categoryDetails = await Category.create({
            name: name,
            description: description
        })
        console.log(categoryDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "error in creating the category"
        })
    }

}

//get all tags

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
          data:allCategories,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.categoryPageDetails = async (req,res) => {
    try{
        //get categoryId 
        const {categoryId}=req.body;
        //get courses for category id
        const selectedCategory = await Category.findById(categoryId)
                                          .populate("courses").exec();
        //validation
        if(!selectedCategory){
            return res.status(500).json({
                success:false,
                message:"data not found"
            })
        }
        //get course for different categories
        const differentCategory = await Category.find({_id:{$ne:categoryId},}).populate("courses").exec();
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