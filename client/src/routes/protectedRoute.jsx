import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;