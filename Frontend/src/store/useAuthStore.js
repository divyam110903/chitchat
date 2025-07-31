import axiosInstance from '../lib/axios';
import { create } from "zustand";
import { toast } from "react-hot-toast"; 
import { io } from 'socket.io-client';

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{ 
    try{
      const res=  await axiosInstance.get("/auth/check");
      set ({authUser:res.data});
      get().connectSocket();

    }catch(error){
        console.error("error in checkauth", error);
        set ({authUser:null});
    }
    finally{
        set({isCheckingAuth:false});
    }

},

signup: async(data)=>{
    set({ isSigningUp:true});
    try{
       const res=  await axiosInstance.post("/auth/signup",data);
       set({authUser:res.data});
       toast.success("Account Created Successfully")
       get().connectSocket();
       return { success: true };
       
    }catch(error){

        toast.error(error.response.data.message);
        return { success: false };
    }finally{
        set({ isSigningUp:false});
    }
},

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

 logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
        get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },



  updateProfile: async(data)=>{
    set({isUpdatingProfile:true})
    try{
      const res=await axiosInstance.put("/auth/updateprofile",data);
      set({authUser:res.data});
      toast.success("Profile Updated")

    }catch(error){
      toast.error("Error Updating");
      console.log("error in updating"+error);

    }finally{
      set({isUpdatingProfile:false});
    }

  },
  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io("http://localhost:5001", {
      query: {
        userId: authUser._id,
      },
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }

}))