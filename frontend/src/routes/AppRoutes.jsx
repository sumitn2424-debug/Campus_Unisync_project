import Auth from "../pages/Auth";
import Home from "../pages/Home";
import { Routes, Route } from "react-router-dom"
import Profile from "../pages/Profile";
import {ProtectedRoutes} from "../components/ProtectedRoutes";
import Messages from "../pages/Message";
import CreatePost from "../pages/CreatePost";
import Marketplace from "../pages/MarketPlace";
import CreateUserPost from "../pages/CreateUserPost";
import CreateProductPost from "../pages/CreateProductPost";

export const AppRoutes = () => {
    return (

        <Routes>
            <Route path="/" element={
                    <Auth />
            } />
            <Route path="/home" element={
                // <ProtectedRoutes>
                    <Home />
                // </ProtectedRoutes>
            } />
            <Route path="/Profile" element={
                // <ProtectedRoutes>
                    <Profile />
                // {/* </ProtectedRoutes> */}
            } />

            <Route path="/Message" element={<Messages />}/>
            <Route path="/createPost" element={<CreatePost />}/>
            <Route path="/createUserPost" element={<CreateUserPost />} />
            <Route path="/createProductPost" element={<CreateProductPost />} />
            <Route path="/marketPlace" element={<Marketplace />}/>
            
            
        </Routes>

    );
};