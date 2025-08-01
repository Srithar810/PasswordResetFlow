import mongoose from "mongoose";
import validator from "validator";


const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address: "+value);
            }
        },

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw  new Error ("Entter a Strong Password: "+value);
            }
        },
    },
    role:{
        type:[String],
        enum:["Admin",'User'],
        default:"User"
    },
    token:{
        type:String,
    },
},
{
    timestamps:true
})

const User = mongoose.model("User",userSchema);
export default User;