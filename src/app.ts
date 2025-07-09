import express, { Application, Request, Response } from "express";
import cors from "cors"
import { userRoutes } from "./app/modules/users/user.routes";

const app:Application = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/user", userRoutes)

app.get("/", (req:Request, res:Response)=>{
    res.send("Here is he Tour managment Backend")
})

export default app