const { instance } = require("../config/rajorpay")
const User = require("../models/User")
const Course = require("../models/Course")
const mailSender = require("../utils/mailSender")

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {

    //get course id and user id 
    const { courseId } = req.body;
    const { userId } = req.user.id;
    //validation

    //valid courseId
    if (!courseId) {
        return res.json({
            success: false,
            message: "please provide valid course id"
        })
    }
    //valid courseDetails
    let course;
    try {
        course = await Course.findById(courseId);
        if (!course) {
            return res.json({
                success: false,
                message: "could not find the course"
            })
        }
        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "student is already enrolled"
            })
        }


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: courseId,
            userId,
        }
    }

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response

        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        })
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "could not initiate order",
        })
    }



}



//verify signature of razorpay and server

exports.verifySignature = async (req, res) => {
    const webhookSecret = "123456";

    const signature = req.headers("x-razorypay-signature")


    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex")

    if (signature === digest) {
        console.log("payment is authorized");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // fulfil the action


            //find the course and students enrolled in it 
            const enrolledCourse = await Course.findOneAndUpdate({ _id: courseId }, {
                $push: {
                    studentsEnrolled: userId
                }
            }, { new: true })

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "course not found"
                })
            }

            console.log(enrolledCourse);


            // find the students and course to their list enrolled courses
            const enrolledStudent = await User.findOneAndUpdate({ _id: userId }, {
                $push: {
                    courses: courseId
                }
            }, { new: true })

            console.log(enrolledStudent);


            //mail send 
            const emailResponse = await mailSender(enrolledStudent.email, "congratulations from studynotion", "Congratulations, you are onboarded into new course")
            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "signature verified and course added"
            })

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

    }

    else {
        return res.status(400).json({
            success: false,
            message: "invalid request"
        })
    }







}