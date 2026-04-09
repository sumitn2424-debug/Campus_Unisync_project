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
import NotFound from "../pages/NotFound";

export const AppRoutes = () => {
    return (

        <Routes>
            <Route path="/" element={
                    <Auth />
            } />
            <Route path="/home" element={
                <ProtectedRoutes>
                    <Home />
                </ProtectedRoutes>
            } />
            <Route path="/Profile" element={
                <ProtectedRoutes>
                    <Profile />
                </ProtectedRoutes>
            } />

            <Route path="/Message" element={
                <ProtectedRoutes>
                    <Messages />
                </ProtectedRoutes>
            }/>
            <Route path="/createPost" element={
                <ProtectedRoutes>
                    <CreatePost />
                </ProtectedRoutes>
            }/>
            <Route path="/createUserPost" element={
                <ProtectedRoutes>
                    <CreateUserPost />
                </ProtectedRoutes>
            } />
            <Route path="/createProductPost" element={
                <ProtectedRoutes>
                    <CreateProductPost />
                </ProtectedRoutes>
            } />
            <Route path="/marketPlace" element={
                <ProtectedRoutes>
                    <Marketplace />
                </ProtectedRoutes>
            }/>
            
            <Route path="*" element={<NotFound />} />
            
        </Routes>

    );
};