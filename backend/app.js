import express from "express";
import { Connection } from "./database/database.js";
import { config } from "dotenv";

config(
    {
        path:"./config/.env"
    }
)

const app = express();
Connection();
export default app;