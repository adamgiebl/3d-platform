import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Parse from "parse/node";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/posts.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Enable unsafe current user since we're in Node.js environment
Parse.User.enableUnsafeCurrentUser();

Parse.initialize(
  process.env.PARSE_APP_ID || "Jn2nFHOhB493ymQJuBrN75XlQyjd1NvIbpULEnsp",
  process.env.PARSE_JS_KEY || "wJk6F64XHBPRN7Qc1udFlcxBbOcw8UAUCilVXFYC",
  process.env.PARSE_MASTER_KEY || "P5Tx28B1hRkSYShFSOGeCqCFlu1AgGXU9g5ipj3a"
);
Parse.serverURL = "https://parseapi.back4app.com/";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Middleware to restore Parse session from cookie
app.use(async (req, res, next) => {
  const sessionToken = req.cookies.sessionToken;
  if (sessionToken) {
    try {
      await Parse.User.become(sessionToken);
    } catch (error) {
      // If session token is invalid, clear it
      res.clearCookie("sessionToken");
    }
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/api/introspect", async (req, res) => {
  try {
    Parse.Cloud.useMasterKey();

    const schema = await Parse.Schema.all();
    const results: any = { classes: {} };

    // Get all classes and their schemas
    for (const classSchema of schema) {
      const className = classSchema.className;
      const query = new Parse.Query(className);
      const count = await query.count();

      results.classes[className] = {
        fields: classSchema.fields,
        count,
        classLevelPermissions: classSchema.classLevelPermissions,
      };
    }

    res.json(results);
  } catch (error: any) {
    console.error("Introspection Error:", error);
    res.status(500).json({ error: error.message });
  }
});

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
