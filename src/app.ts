import express, { Application, Request, Response } from "express";


const app:Application = express()

app.get("/", (req:Request, res:Response)=>{
    res.send("Here is he Tour managment Backend")
})

export default app