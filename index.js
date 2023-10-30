import express from "express"; 
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "./models/User.js"; 
// import "./db.js"; 

config(); 
const app = express(); 
const { PORT, DB_URI } = process.env;
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 


//public route
app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to our API!"}); 
}); 

//register user
app.post("/auth/register", async(req, res) => {
    const { name, email, password, confirmPassword } = req.body;     

    //validation
    if(!name) {
        res.status(422).json({message: "Name is required"}); 
        return ; 
    }

    if(!email) {
        res.status(422).json({message: "Email is required"}); 
        return ; 
    }

    if(!password) {
        res.status(422).json({message: "Password is required"}); 
        return ; 
    }

    if(!confirmPassword) {
        res.status(422).json({message: "Confirm password is required"}); 
        return ; 
    }

    if(password !== confirmPassword) {
        res.status(422).json({message: "Passwords don't match"}); 
        return ; 
    }

    //check if user already exists
    const userExists = await User.findOne({email: email}); 
    if(userExists) {
        res.json({message: "User already exists"}); 
        return ; 
    }

    //create password hash 
    const salt = await bcrypt.genSalt(12); 
    const passwordHash = await bcrypt.hash(password, salt); 

    //create new user
    const userObj = new User({
        name, 
        email, 
        password: passwordHash
    }); 
    try {
        const result = await userObj.save(); 
        res.status(201).json({ message: `User created successfully!` });
    } catch(error) {
        console.log(error); 
        res.status(500).json({message: `Failed to create user`}); 
    }
}); 


//database connection
mongoose.connect(`${DB_URI}`)
    .then(resp => {
        const listener = app.listen(PORT || 3000, () => {
            console.log(`App is running on http://localhost:${PORT}`); 
            console.log(`Connected successfully!`);
            // console.log(resp); 
        }); 
    })
    .catch(err => {
        console.log(`Connection failed: ${err}`); 
    })



