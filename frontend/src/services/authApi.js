import axios from "axios";

const API = axios.create({
    baseURL:"http://localhost:3000/api/auth",
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

