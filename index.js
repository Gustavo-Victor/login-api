import express from "express"; 
import bycript from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";
import { config } from "dotenv"; 
// import "./db.js"; 

config(); 
const app = express(); 
const { PORT, DB_URI } = process.env;

//public route
app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to our API!"}); 
}); 


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



