import express, { Application, Request, Response } from "express";
import cors from "cors"
import { router } from "./app/routes";
import { globalError } from "./app/middleware/globalError";
import { StatusCodes } from "http-status-codes";
import notFound from "./app/middleware/notFound";

const app:Application = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1", router)

app.get("/", (req:Request, res:Response)=>{
    res.send("Here is he Tour managment Backend")
})

// Handling Global Erro
app.use(globalError)

// Handling not found
app.use(notFound)

export default app