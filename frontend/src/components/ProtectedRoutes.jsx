import {Navigate, useLocation} from "react-router-dom"
import { useAuth } from '../hooks/useAuth'
import Loader from './Loader'

export const ProtectedRoutes = ({children}) => {
    const {userInformation, isCheckingAuth} = useAuth();
    const location = useLocation();
    
    if(isCheckingAuth) {
        return <Loader />;
    }
    
    if(!userInformation) {
        return <Navigate to="/" replace />
    }
    
    if (userInformation.role !== 'admin') {
      const isPending = userInformation.status === 'pending';
      const isRejected = userInformation.status === 'rejected';
      const isApproved = userInformation.status === 'approved';
      const isSetupRoute = location.pathname === '/setup-profile';
      const isApprovalRoute = location.pathname === '/waiting-approval';

      // 1. Rejected users MUST ONLY see the approval/rejected screen.
      if (isRejected) {
        if (!isApprovalRoute) {
          return <Navigate to="/waiting-approval" replace />;
        }
        return children;
      }

      // 2. Pending users have two phases: Profile Setup and Waitlist.
      if (isPending) {
        if (!userInformation.isProfileComplete) {
           // Not completed profile? Must be on setup route.
           if (!isSetupRoute) {
             return <Navigate to="/setup-profile" replace />;
           }
           return children;
        } else {
           // Profile completed? Must be on wait list route.
           if (!isApprovalRoute) {
             return <Navigate to="/waiting-approval" replace />;
           }
           return children;
        }
      }

      // 3. Approved users shouldn't manually visit setup or waitlist.
      if (isApproved && (isApprovalRoute || isSetupRoute)) {
        return <Navigate to="/home" replace />;
      }
    }

    return children
}
