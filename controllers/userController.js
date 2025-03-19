import User from "../models/User.js";
import validator from "validator";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";


// Function for user registration
export const userRegister = async (req, res) => {
   // Extract user data 
   const { firstName, lastName, email, password, conPassword } = req.body;
   try {
      // Validation to check all the fields are required 
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

      // Regular expression to validate password and validation to validate password
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

      // Check if the user already exists if exists return an error message to the client
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

      // Send a response data to the client after successfull registeration
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
      // Handle an error occurred during user registeration
      return res.status(500).json({
         message: "An error occurred during user registration",
         error: error.message,
      });
   }
};


// Function for user login
export const userLogin = async (req, res) => {
   // Extract email and password
   const { email, password } = req.body;
   try {
      //   Validation to check both email and password is required
      if (!email || !password) {
         return res.status(400).json({ message: "All fields are required" });
      }

      //   Check user already exists if yes then return error message to the client
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare password if not match then return error message
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      // After successful login return response data
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
      // Handle error occurred druing user login
      return res.status(500).json({
         message: "An error occurred during user login",
         error: error.message,
      });
   }
};

// Function for fetching user profile
export const userProfile = async (req, res) => {

   //  Extracting the token from the Authorization header
   const token = req.headers.authorization?.split(" ")[1];

   // if token not available return error message
   if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   try {
      // if token is available then verify the token and extract the user id from it and used this id for fetching user data
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      // If user user not found return error message
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // If found then send response data 
      res.status(200).json({ user });
   } catch (error) {
      // Handle error during fetching user profile
      return res.status(500).json({
         message: "An error occurred while fetching user profile",
         error: error.message,
      });
   }
}