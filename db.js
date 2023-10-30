import mongoose from "mongoose";
import { config } from "dotenv"; 
config(); 

const { DB_URI } = process.env;

async function main() {
    await mongoose.connect(`${DB_URI}`); 
    console.log(`Connected successfully!`); 
}

main().catch(err => console.log(`Connection failed: ${err}`)); 
