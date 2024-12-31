import { Router } from "express";
import Parse from "parse/node";

const router = Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new Parse User
    const user = new Parse.User();
    user.set("username", username);
    user.set("email", email);
    user.set("password", password);

    // Sign up the user and get session token
    const result = await user.signUp();
    const sessionToken = result.getSessionToken();

    res.json({
      sessionToken,
      user: {
        id: result.id,
        username: result.get("username"),
        email: result.get("email"),
      },
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Log in the user and get session token
    const user = await Parse.User.logIn(username, password);
    const sessionToken = user.getSessionToken();

    res.json({
      sessionToken,
      user: {
        id: user.id,
        username: user.get("username"),
        email: user.get("email"),
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  try {
    const { sessionToken } = req.body;
    if (sessionToken) {
      // Become the user to ensure we're logging out the correct session
      await Parse.User.become(sessionToken);
      await Parse.User.logOut();
    }
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const sessionToken = req.headers["x-parse-session-token"] as string;
    if (!sessionToken) {
      return res.status(401).json({ error: "No session token provided" });
    }

    // Validate the session token
    const user = await Parse.User.become(sessionToken);
    if (!user) {
      return res.status(401).json({ error: "Invalid session token" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.get("username"),
        email: user.get("email"),
      },
    });
  } catch (error: any) {
    console.error("Get Current User Error:", error);
    res.status(401).json({ error: error.message });
  }
});

export default router;
