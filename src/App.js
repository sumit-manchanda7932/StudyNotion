import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import Navbar from './components/common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import Login from "./pages/Login"
import Signup from "./pages/Signup";
function App() {
  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
           

        <Route path="forgot-password" element={<ForgotPassword/>} />
        <Route path="reset-password/:id" element={<UpdatePassword/>} />
        <Route path="verify-email" element={<VerifyEmail/>} />
        <Route
          path="/login"
          element={
              <Login />
          }
        />

        <Route
          path="/signup"
          element={
              <Signup />
          }
        />

      </Routes>
    </div>
  );
}

export default App;
