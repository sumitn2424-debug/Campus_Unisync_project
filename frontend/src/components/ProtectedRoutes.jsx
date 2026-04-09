import {Navigate} from "react-router-dom"
import { useAuth } from '../hooks/useAuth'
export const ProtectedRoutes = ({children}) => {
    const {userInformation} = useAuth();
    if(!userInformation){
        return <Navigate to="/" replace />
    }
  return children
}
