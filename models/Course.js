const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    courseDescription:{
        type:String,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Section",
        }
    ],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
           ref:"RatingAndReview",
    }],
    price:{
       type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
    

})


module.exports=mongoose.model("Course",courseSchema)