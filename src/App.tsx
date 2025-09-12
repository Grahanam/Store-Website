import './App.css'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Home';
import ProtectedRoute from './utils/ProtectedRoutes';
import AuthRoute from './utils/AuthRoutes';
import AdminDashboard from './pages/home/AdminDashboard';
import OwnerDashboard from './pages/home/OwnerDashboard';
import Unauthorized from './pages/unathorized/Unauthorized';


const router=createBrowserRouter(
   createRoutesFromElements(
    <Route path="/" >
      <Route element={<ProtectedRoute allowedRoles={["user"]}/>}>
           <Route index path='/' element={<Home/>}  />    
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["owner"]}/>}>
           <Route index path='/ownerDashboard' element={<OwnerDashboard/>}  />    
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
           <Route index path='/adminDashboard' element={<AdminDashboard/>}  />    
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<AuthRoute/>}>
        <Route path="login" element={<SignIn/>}/>
        <Route path="signup" element={<SignUp/>}/>
      </Route> 
    </Route>
   )
)

function App({}) {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
