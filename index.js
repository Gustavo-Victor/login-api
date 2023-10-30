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
        res.status(201).json({ message: `User registered successfully!` });
    } catch(error) {
        console.log(error); 
        res.status(500).json({message: `User registration failed`}); 
    }
}); 

//login user
app.post("/auth/login", async(req, res) => {

    const { email, password } = req.body; 

    //validation
    if(!email) {
        res.status(422).json({message: "Email is required"}); 
        return ;
    }

    if(!password) {
        res.status(422).json({message: "Password is required"}); 
        return ;
    }

    //check if user exists
    const user = await User.findOne({email}); 
    if(!user) {
        res.status(404).json({message: "User not found"}); 
        return ;
    }

    //check if passwords match
    const passwordsMatch = await bcrypt.compare(password, user.password); 
    if(!passwordsMatch) {
        res.status(422).json({message: "Invalid password"}); 
        return ; 
    }

    //login user
    const secret = process.env.SECRET; 
    
    try {
        const token = jwt.sign(
            { id: user._id, }, 
            secret
        ); 
        res.status(200).json({ message: "User successfully authenticated", token}); 
    } catch (error) {
        console.log(error); 
        res.status(500).json({message: "User authentication failed"}); 
    }
}); 

//private route
app.get("/user/:id", checkToken, async(req, res) => {
    const { id } = req.params; 

    //check if user exists
    try {
        const user = await User.findById(id, "-password"); 
        res.status(200).json(user); 
    } catch (error) {
        console.log(error); 
        res.status(404).json({message: "User not found"}); 
    }
});

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"]; 
    const token = authHeader && authHeader.split(" ")[1]; 

    if(!token) {
        res.status(401).json({message: "Access denied"});
        return ;  
    }

    try {
        const secret = process.env.SECRET; 
        jwt.verify(token, secret); 
        next(); 
    } catch (error) {
        console.log(error); 
        res.status(400).json({message: "Invalid token"}); 
    }
}

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



