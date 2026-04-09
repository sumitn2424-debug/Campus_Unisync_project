import {Navigate} from "react-router-dom"
import { useAuth } from '../hooks/useAuth'
import Loader from './Loader'

export const ProtectedRoutes = ({children}) => {
    const {userInformation, isCheckingAuth} = useAuth();
    
    if(isCheckingAuth) {
        return <Loader />;
    }
    
    if(!userInformation) {
        return <Navigate to="/" replace />
    }
    
    return children
}
