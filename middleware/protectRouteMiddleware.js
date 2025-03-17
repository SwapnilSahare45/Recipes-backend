import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "No token, access denied"});
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user= decode.id;
        next();
    }catch(error){
        res.status(401).json({message: "Invalid token"});
    }
}