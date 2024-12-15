import { Router } from "express";
import Parse from "parse/node";

const router = Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new Parse.User();
    user.set("username", username);
    user.set("email", email);
    user.set("password", password);

    const result = await user.signUp();
    console.table({
      Action: "User Registration",
      Username: username,
      Status: "Success",
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: result.id });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Parse.User.logIn(username, password);

    console.table({
      Action: "User Login",
      Username: username,
      Status: "Success",
    });

    res.json({
      message: "Login successful",
      userId: user.id,
      sessionToken: user.getSessionToken(),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(401).json({ error: error.message });
  }
});

export default router;
