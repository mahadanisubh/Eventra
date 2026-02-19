import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; 
  next();
};

export const isRole= async(req, res, next) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({ message: "Access denied" });
  }
  next();
}