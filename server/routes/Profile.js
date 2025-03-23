const express = require("express")
const router = express.Router()
const {auth,isInstructor}=require("../middlewares/auth")
const {deleteAccount,updateProfile,getAllUserDetails,updateDisplayPicture,getEnrolledCourses}= require("../controllers/Profile")



router.delete("/deleteProfile",auth,isDemo,deleteAccount)
router.put("/updateProfile", auth,isDemo, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth,isDemo, updateDisplayPicture)


module.exports=router;