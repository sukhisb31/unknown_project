import express from "express";
import { Connection } from "./database/database.js";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import userRouter from "./routers/userRouters.js";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

config(
    {
        path:"./config/.env"
    }
);


app.use (
    cors ({
        origin : [process.env.FRONTEND_URL],
        methods : ["GET", "POST", "PUT", "DELETE"],
        credentials : true,
    })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}))

app.use("/api/user", userRouter);


Connection();
app.use(errorMiddleware);
export default app;