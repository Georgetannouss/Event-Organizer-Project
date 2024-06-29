const express = require("express");
const bcrypt = require("bcrypt"); // Necessary for password security (not utilized here)
const jwt = require("jsonwebtoken"); // For handling authentication tokens
const mongoose = require("mongoose"); // MongoDB integration

// Defining the schema for User in MongoDB
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["viewer", "editor"] },
  org: { type: mongoose.Schema.Types.ObjectId, ref: "org", required: true },
}, {
  collection: "users", // This specifies the MongoDB collection
});

// Generating a Mongoose model based on the schema
const UserModel = mongoose.model("User", UserSchema);

const router = express.Router(); // This initializes routing capabilities

// API endpoint for user authentication
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user by username
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      console.error(`No user found with username: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // This is placeholder logic for password verification
    if (password !== user.password) {
      console.error("Incorrect password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Define payload for the JWT
    const tokenPayload = {
      id: user._id,
      username: user.username,
      role: user.role,
      org: user.org.toString(),
    };

    // Generate JWT
    jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) {
        console.error("Token signing error:", err);
        return res.status(500).json({ message: "Error generating token" });
      }
      res.json({ token: token });
    });

  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router; // Export the router for use in other parts of the app
