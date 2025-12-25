import api from "./axiosInstance";

export const registerUser=async(email,password)=>{
    const res=await api.post("/user/register",{email,password})
    return res;
}

export const loginUser = async ( email, password) => {
  const res = await api.post(
    "/user/login",
    { email, password },
    { withCredentials: true }
  );
  return res;
};

export const logout=()=>{
   api.post("/user/logout");
}
