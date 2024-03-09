import mongoose from "mongoose";

export let connectToDatabase = async()=>{
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("database is connected.😁");
    } catch (error) {
       console.log(error); 
    }
}