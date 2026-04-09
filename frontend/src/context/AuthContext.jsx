import { useState } from "react";
import {createContext} from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate()

    const [userInformation, setUserInformation] = useState(null)

    const logOut = () => {
        setUserInformation(null)
       try {
        api.post('/auth/logout')
        navigate('/')
       } catch (error) {
        console.log(error)
       }
    }


    return (
        <AuthContext.Provider value={{setUserInformation,userInformation,logOut}}>
            {children}
        </AuthContext.Provider>
    )
}