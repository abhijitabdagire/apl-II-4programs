// const express = require("express");
// const app = express();

// const PORT = 3000;

// // Define a route for the root URL
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// // Define a sample route that returns JSON
// app.get("/api/data", (req, res) => {
//   res.json({ message: "Hello from the API!", success: true });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

const mongoURI = "mongodb://localhost:27017/mydatabase";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// Routes
// 1. Create a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// 2. Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// 3. Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
});

// 4. Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});