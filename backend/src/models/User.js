import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
            trim: true

        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim :true,
        },
        phone:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password:{
            type: String,
            default: null,
        },
        isVerified:{
            type: Boolean,
            default: false,
        },
        otpHash:{
            type: String,
            default: null,
        },
        otpExpiresAt:{
            type: Date,
            default: null,
        },
        otpPurpose:{
            type: String,
            enum: ["REGISTER","LOGIN","FORGOT_PASSWORD"],
          default: null,
        },
        otpAttempts:{
            type:Number,
            default: 0,
        },
        lastOtpSentAt:{
            type:Date,
            default: null,
        },
        failedLoginAttempts:{
            type:Number,
            default: 0,
        },
        lockUntil:{
            type:Date,
            default:null,
        },
        refreshToken:{
            type:String,
            default:null,
        },


    },
    {
        timestamps:true,
    }
);
const User = mongoose.model("User", userSchema);
export default User;