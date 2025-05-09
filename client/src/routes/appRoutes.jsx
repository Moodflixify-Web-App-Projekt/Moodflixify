import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/authContext.jsx';
import App from '../App.jsx';
import Home from '../pages/home.jsx';
import Login from '../pages/login.jsx';
import Register from '../pages/register.jsx';
import Dashboard from '../pages/dashboard.jsx';

function ProtectedRoute({ children }){
    const { user } = useAuth() || {user: null};
    if(!user){
        return <Navigate to="/login" />
    }
    return children;
}

const router = createBrowserRouter([
    {
        element: <AuthProvider><App /></AuthProvider>,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
            { path: '/dashboard/media', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
            { path: '/dashboard/recommendations', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
            { path: '*', element: <Home /> },
        ],
    },
]);

export default router;