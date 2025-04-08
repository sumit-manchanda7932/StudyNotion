import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/operations/authAPI';
function ProfileDropDownMenu() {


    const dispatch=useDispatch();
    const navigate=useNavigate();
     function clickHandler()
     {
        dispatch(logout(navigate))
     }

  return (

    <div>
        <button onClick={clickHandler}>Logout</button>
    </div>
  )
}

export default ProfileDropDownMenu