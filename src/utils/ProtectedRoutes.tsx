import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  const parseUser = JSON.parse(user);
  return allowedRoles.includes(parseUser.role) ? <Outlet /> : <Navigate to="/unauthorized" />;

};

export default ProtectedRoute;