import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import Navbar from "./COMPONENTS/Navbar";
import { Routes ,Route} from 'react-router-dom'
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
const App = () => {

 const{authUser,checkAuth,isCheckingAuth, onlineUsers}= useAuthStore();
const {theme}= useThemeStore();

console.log(onlineUsers);

 useEffect(()=>{
  checkAuth()
 },[checkAuth]);
 
 console.log({authUser});

 if(isCheckingAuth && !authUser) return (
  <div className="flex items-center justify-center h-screen">
<Loader className="size-10 animate-spin" />
</div>
 )
  return (
    <div data-theme={theme}>
      <Navbar/>

    <Routes>
  <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" replace />} />
  <Route path="/signup" element={authUser ? <Navigate to="/settings" replace /> : <SignupPage />} />
  <Route path="/login" element={authUser ? <Navigate to="/settings" replace /> : <LoginPage />} />
  <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" replace />} />
  <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
</Routes>
      <Toaster/>

    </div>
  )
}

export default App

