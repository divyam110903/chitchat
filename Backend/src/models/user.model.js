import mongoose from "mongoose";
import { type } from "os";
const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,     
        unique: true
    },
    fullname:{
        type: String,
        required: true
    },  
    password:{
        type: String,
        required: true ,
        minlength:8
    },
    profilepic:{
        type:String,
         default: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    }

},
{
    timestamps: true,
}


)  

const User =mongoose.model('User',UserSchema);
export default User;