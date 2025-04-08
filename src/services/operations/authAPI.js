import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast"
import { setLoading,setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { endpoints } from "../apis"



const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSWORD_API,
    RESETPASSTOKEN_API,
  } = endpoints
  

export function getPasswordResetToken(email,setemailSent)
{
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
             const response =await apiConnector("POST",RESETPASSTOKEN_API,{email});
             console.log("Reset Password Token response",response);

             if(!response.data.success){
                throw new Error(response.data.message);
                
             }
             toast.success("Reset Email Sent")
             setemailSent(true);
        }
        catch(error)
        {
           console.log("Reset passwrod token error")
        }
        dispatch(setLoading(false));
    }
}


export function resetPassword(password,confirmPassword,token,setresetComplete)
{
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
             const response =await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token});
             console.log("Reset Password response",response);

             if(!response.data.success){
                throw new Error(response.data.message);
                
             }
             toast.success("password reset successfully")
             setresetComplete(true)
        }
        catch(error)
        {
           console.log("Reset password error")
        }
        dispatch(setLoading(false));
    }
}


export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
  ) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SIGNUP_API, {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
        })
  
        console.log("SIGNUP API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Signup Successful")
        navigate("/login")
      } catch (error) {
        console.log("SIGNUP API ERROR............", error)
        toast.error("Signup Failed")
        navigate("/signup")
      }
      dispatch(setLoading(false))

    }
  }


export function sendOtp(email,navigate){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try{
          const response = await apiConnector("POST",SENDOTP_API,{
             email,
          })

          console.log("sendotp api response",response)

          if(!response.data.success){
            throw new Error(response.data.message)
          }

          toast.success("OTP sent successfully")
          navigate("/verify-email")
          toast.success("e");
        }
        catch(error){
            console.log("SENDOTP API ERROR............", error)
      toast.error(error?.response?.data?.message)
        }
        dispatch(setLoading(false))
    }
}



export function login(email, password, navigate) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", LOGIN_API, {
          email,
          password,
        })
  
        console.log("LOGIN API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Login Successful")
        dispatch(setToken(response.data.token))
        // const userImage = response.data?.user?.image
        //   ? response.data.user.image
        //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
        // dispatch(setUser({ ...response.data.user, image: userImage }))
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("token", JSON.stringify(response.data.token))
        navigate("/dashboard/my-profile")
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error(error.response.data.message)
      }
      dispatch(setLoading(false))
    }
  }



  
export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
    //   dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }