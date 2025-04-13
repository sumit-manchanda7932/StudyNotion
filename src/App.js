import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import Navbar from './components/common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import Login from "./pages/Login"
import Signup from "./pages/Signup";
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import MyProfile from "./components/core/dashboard/MyProfile"
import Settings from './components/core/dashboard/Settings';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import AddCourse from './components/core/dashboard/AddCourse';
import Cart from './components/core/dashboard/Cart';
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import MyCourses from './components/core/dashboard/MyCourses/MyCourses';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import EnrolledCourses from './components/core/dashboard/EnrolledCourses';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/ViewDetails';
function App() {

  const user = useSelector((state) => state.profile.user);
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


<Route path="/about" element={<About />} />

<Route path="/contact" element={<ContactUs />} />

<Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings/>} />

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses/>} />
              </>
          )
         }
    </Route>

    <Route path="/catalog/:catalog" element={<Catalog />} />
    <Route path="/courses/:courseId" element={<CourseDetails />} />


    {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              {/* <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              /> */}
            </>
          )}


<Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>


    <Route path="hello" element={<AddCourse/>}/>
      </Routes>
    </div>
  );
}

export default App;
