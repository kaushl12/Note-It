import api from "./axiosInstance";

export const registerUser=async(email,password)=>{
    const res=await api.post("/user/register",{email,password})
    return res;
}