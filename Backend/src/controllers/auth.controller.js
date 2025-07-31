import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup= async(req, res) => {
    const { email, fullname, password, profilepic } = req.body;
    try{

        if(!email || !fullname || !password){
            return res.status(400).send('Please fill all the fields');
        }
        if(password.length <6){
             return res.status(400).send('Password must be at least 6 characters long');
        
        }
        const user=await User.findOne({email});
        if(user) return res.status(400).send('User already exists');

          
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullname : fullname,
        email: email,
        password: hashedPassword,
        profilepic: profilepic || '',
    })

    if(newUser) {
       //generate jwt token
       generateToken(newUser._id, res);
       await newUser.save();
       res.status(201).send({
        _id: newUser._id,
        fullname: newUser.fullname,     
        email: newUser.email,
        profilepic: newUser.profilepic,
       });
    }


    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const login=  async(req, res) => {
   console.log('Login req.body:', req.body);
        const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email or password missing' });
  }
        try{
            //id
           const user= await User.findOne({email});
           if(!user) return res.status(400).json({message: 'Invalid Credentials'}  );
         //pwd
           const pwd= await bcrypt.compare(password, user.password);
        if(!pwd) return res.status(400).json({message: 'Invalid Credentials'});

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilepic: user.profilepic,
        });


    }catch(error){
        console.error(error);
       res.status(500).json({message:'Internal Server Error'});
    }
}


export const logout= (req, res) => {
 
    try{
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message: 'Logged out successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal Server Error'});
    }
}



export const updateprofile= async(req, res) => {
    try{
const {profilepic}=req.body;
const userId= req.user._id;
if(!profilepic){
res.status(400).json({message: 'Please provide a profile picture '});
}
const uploadResponse=await cloudinary.uploader.upload(profilepic);
const updatedUser= await User.findByIdAndUpdate(userId, {profilepic: uploadResponse.secure_url}, {new: true});

res.status(200).json(updatedUser);
    }catch(error){
console.error(error);
res.status(500).json({message: 'Internal Server Error'});
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};  
