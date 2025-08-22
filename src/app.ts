import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalError } from "./app/middleware/globalError";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/config/passportJs"
import { envVars } from "./app/config/env";
import session from "express-session";

const app: Application = express();


app.use(
  session({
    secret: envVars.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cors({
  origin:envVars.FRONEND_URL,
  credentials:true,
}));
app.use(express.json());
app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Here is he Tour managment Backend");
});

// Handling Global Erro
app.use(globalError);

// Handling not found
app.use(notFound);

export default app;
