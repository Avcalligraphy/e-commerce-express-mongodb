import userModel from "../models/userModel.js";
import validator from 'validator'
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// route for user login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({ success: false, message: "User doesn't exists" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            const token = createToken(user._id)
            res.json({
                success:true,
                token
            })
        }else{
            res.status(401).send({
                success:false,
                message: "Invalid credentials"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}


// route for user register
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body

        // checking user already exists or not

        const exists = await userModel.findOne({email})
        if (exists) {
            return res.status(401).json({success:false, message:"User already exists" })
        }

        if(!validator.isEmail(email)) {
            return res
              .status(401)
              .json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
          return res.status(401).json({
            success: false,
            message: "Please enter a strong password",
          });
        }

        // hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.status(201).json({
            success:true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(401).json({
          success: false,
          message: error.message,
        });
        
    }
}

// route for admin login
const adminLogin = async (req, res) => {


};

export {loginUser, registerUser, adminLogin}