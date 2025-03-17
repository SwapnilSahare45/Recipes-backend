import User from "../models/User.js";
import validator from "validator";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";


// Controller for user registration
export const userRegister = async (req, res) => {
   const { firstName, lastName, email, password, conPassword } = req.body;
   try {
      //Validate required fields
      if (!firstName || !lastName || !email || !password) {
         return res.status(400).json({ message: "All fields are required" });
      }

      // Validate email format
      if (!validator.isEmail(email)) {
         return res.status(400).json({ message: "Email format not correct" });
      }

      // Validate password
      if (password.length < 8) {
         return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Regular expression to validate password
      const uppercaseRegex = /[A-Z]/;
      const numberRegex = /\d/;
      const specialCharRegex = /[@$!%*?&]/;
      if (!uppercaseRegex.test(password)) {
         return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
      }

      if (!numberRegex.test(password)) {
         return res.status(400).json({ message: "Password must contain at least one number" });
      }

      if (!specialCharRegex.test(password)) {
         return res.status(400).json({ message: "Password must contain at least one special character" });
      }

      if (password !== conPassword) {
         return res.status(400).json({ message: "Password not match" });
      }

      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
         return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user
      const newUser = await User.create({
         firstName,
         lastName,
         email,
         password,
      })

      //Success response
      res.status(201).json({
         message: "User registered successfully",
         user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
         },
      });

   } catch (error) {
      return res.status(500).json({
         message: "An error occurred during user registration",
         error: error.message,
      });
   }
};


// Controller for user login
export const userLogin = async (req, res) => {
   const { email, password } = req.body;
   try {
      // Validate required fields
      if (!email || !password) {
         return res.status(400).json({ message: "All fields are required" });
      }

      // Check user exists
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({ message: "Invalid email or password" });
      }

      // Check  password match
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generating token
      const token = generateToken(user._id);

      res.status(200).json({
         message: "Login successful",
         userData: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
         },
         token,
      })

   } catch (error) {
      return res.status(500).json({
         message: "An error occurred during user login",
         error: error.message,
      });
   }
};

// Controller for fetching user profile
export const userProfile = async (req, res) => {
   const token = req.headers.authorization?.split(" ")[1];
   if(!token) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
         console.log("User not found");
         return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
   } catch (error) {
      return res.status(500).json({
         message: "An error occurred while fetching user profile",
         error: error.message,
      });
   }
}