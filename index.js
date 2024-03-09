import express from "express"
import { connectToDatabase } from "./src/database/connnectToDB.js"
import dotenv from "dotenv"
import userRouter from "./src/routes/users.routes.js"
import cors from "cors"
dotenv.config({
    path: './.env'
})
let app = express()

app.use(express.json())
app.use(cors())
let port =process.env.PORT ||8000

app.use("/",userRouter)

connectToDatabase()
.then(()=>{
    app.listen(port,()=>{
        console.log("connected to express server.!!!");
    })
})
.catch(()=>{
    console.log("problem while connecting to express server.");
})

