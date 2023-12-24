import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// to limit how much json data can be sent to the server
app.use(express.json({ limit: "16kb" }));

// to parse url encoded data | extended: true means that we can send nested objects
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// to serve static files
app.use(express.static("public"));

// to parse cookies
app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.routes.js";

// Routes Declaration
app.use("/api/v1/users", userRouter);

export default app;
