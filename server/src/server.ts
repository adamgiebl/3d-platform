import express from "express";
import cors from "cors";
import Parse from "parse/node";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/posts.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

Parse.initialize(
  "Jn2nFHOhB493ymQJuBrN75XlQyjd1NvIbpULEnsp",
  "wJk6F64XHBPRN7Qc1udFlcxBbOcw8UAUCilVXFYC",
  "YOUR_MASTER_KEY"
);
Parse.serverURL = "https://parseapi.back4app.com/";

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "3D Social Media API is running" });
});

app.listen(PORT, () => {
  console.table({
    "Server Status": "Running",
    Environment: process.env.NODE_ENV || "development",
    Port: PORT,
  });
});

export default app;
