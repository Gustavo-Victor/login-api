import express from "express"; 
import bycript from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import { config } from "dotenv";

config(); 
const app = express(); 
const { PORT } = process.env;

//public route
app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to our API!"}); 
}); 

const listener = app.listen(PORT || 3000, () => {
    console.log(`App is running on http://localhost:${PORT}`); 
}); 


