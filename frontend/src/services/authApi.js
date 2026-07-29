import axios from "axios";

const API = axios.create({
    baseURL:"https://auth-system-grxw.vercel.app/api/auth",
});

export const registerUser = (data) =>{
    return API.post("/register",data);
};

export const verifyOTP = (data)=>{
    return API.post("/verify-otp", data);
};

export const loginUser =(data)=>{
    return API.post("/login",data);
}

export default API;

