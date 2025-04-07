import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import profileRedcuer  from "../slices/profileSlice"
import cartReducer from "../slices/cartSlice"

const  rootReducer = combineReducers({
     auth:authReducer,
     profile:profileRedcuer,
     cart:cartReducer,
})


export default rootReducer;