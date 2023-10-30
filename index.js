import express from "express"; 
import bycript from "bcrypt"; 
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

    res.status(200).json({
        name, 
        email, 
        password, 
        confirmPassword, 
        newProp: "ok"
    }); 
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



