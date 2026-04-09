import { useState, useEffect, createContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();

    const [userInformation, setUserInformation] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/me");
                if (res.data.user) {
                    setUserInformation(res.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user session", error);
                setUserInformation(null);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        fetchUser();
    }, []);

    const logOut = () => {
        setUserInformation(null);
       try {
        api.post('/auth/logout');
        toast.success("Successfully logged out!");
        navigate('/');
       } catch (error) {
        console.log(error);
        toast.error("Failed to log out");
       }
    };

    return (
        <AuthContext.Provider value={{setUserInformation, userInformation, isCheckingAuth, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};