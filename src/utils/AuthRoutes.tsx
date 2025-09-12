import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return token&&user? <Navigate to="/"/>:<Outlet/>;
};

export default AuthRoute;