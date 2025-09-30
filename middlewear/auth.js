import jwt from "jsonwebtoken";

 export function verifyJWT(req, res,next)
  {
    const authHeader = req.header("Authorization");
    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        try {
            const decoded = jwt.verify(token, "random456"); // your secret key
            req.user = decoded; 
        } catch (err) {
            console.log("Invalid token:", err.message);
            req.user = null; 
        }
    }
    next(); 
};