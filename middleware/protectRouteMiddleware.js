import jwt from "jsonwebtoken";

// Function/middleware for protect routes
export const protectRoute = (req, res, next)=>{
    // Extract token from autherization header 
    const token = req.headers.authorization?.split(" ")[1];

    // If token is not avaialbe return error message
    if(!token){
        return res.status(401).json({message: "No token, access denied"});
    }
    try{
        // // If available then verify. If token successfully verfiy then user can access the route
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user= decode.id;
        next();
    }catch(error){
        // If there is no token avaialbe or any other error ouccurred
        res.status(401).json({message: "Invalid token"});
    }
}