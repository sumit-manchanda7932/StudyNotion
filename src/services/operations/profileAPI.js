
import { apiConnector } from "../apiconnector";
import { settingsEndpoints} from "../apis";
import toast from "react-hot-toast";
import { logout } from "./authAPI";



//updateAdditionalDetails
export async function updateAdditionalDetails(token,additionalDetails){
    console.log("additionalDetails",additionalDetails);
    const {firstName,lastName,dateOfBirth,gender,contactNumber,about}=additionalDetails;
    console.log("additionalDetails",additionalDetails);
    try {
      const response = await apiConnector("PUT", settingsEndpoints.UPDATE_PROFILE_API,{firstName,lastName,dateOfBirth,gender,contactNumber,about},{
        Authorisation: `Bearer ${token}`,
      });
      console.log("UPDATE_ADDITIONAL_DETAILS_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Additional Details Updated Successfully");
      const user = JSON.parse(localStorage.getItem("user"));
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.additionalDetails.dateOfBirth = dateOfBirth  || user.additionalDetails.dateOfBirth;
      user.additionalDetails.contactNumber = contactNumber || user.additionalDetails.contactNumber;
      user.additionalDetails.about = about || user.additionalDetails.about;
      user.additionalDetails.gender=gender
      localStorage.setItem("user",JSON.stringify(user));
  
    } catch (error) {
      console.log("UPDATE_ADDITIONAL_DETAILS_API API ERROR............", error)
      toast.error(error.response.data.message)
    }
  }
  
  


//updateProfilePicture
export async function updatePfp(token,pfp){
    try {
      const formData = new FormData();
      console.log("pfp",pfp)
      formData.append('pfp',pfp);
      const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,formData,{
        Authorisation: `Bearer ${token}`,
      });
      console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Picture Updated Successfully");
      const imageUrl = response.data.data.image;
      localStorage.setItem("user",JSON.stringify({...JSON.parse(localStorage.getItem("user")),image:imageUrl}));
      console.log(JSON.parse(localStorage.getItem("user")).image);
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error(error.response.data.message);
    }
  }
  
  
  //deleteAccount
  export async function deleteAccount(token,dispatch,navigate){
    try {
      const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API,null,{
        Authorisation: `Bearer ${token}`,
      });
      console.log("DELETE_ACCOUNT_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Account Deleted Successfully");
      dispatch(logout(navigate))
    }
    catch (error) {
      console.log("DELETE_ACCOUNT_API API ERROR............", error)
      toast.error(error.response.data.message)
    }
  }



  export async function updatePassword(token,password){
    const { oldPassword, newPassword, confirmPassword:confirmNewPassword }=password;
    console.log("password",password);
    
    try {
     const response = await apiConnector("POST", settingsEndpoints.CHANGE_PASSWORD_API,{oldPassword, newPassword, confirmNewPassword},{
        Authorisation: `Bearer ${token}`,
      });
      console.log("UPDATE_PASSWORD_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Password Updated Successfully");
    }
    catch (error) {
      console.log("UPDATE_PASSWORD_API API ERROR............", error)
      toast.error(error.response.data.message)
    }
  }
  
