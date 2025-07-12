// Auth.js Skydda rutter från obehörig åtkomst. Skicka tillbaka fel om något är fel.

import jwt from "jsonwebtoken";
 

// Den kontrollerar om en inkommande begäran (request) innehåller en giltig JWT-token i Authorization-huvudet. 
// Om token saknas eller är ogiltig, blockeras begäran. Om den är giltig, får begäran gå vidare



// Letar efter Authorization-huvudet. Om det saknas, svarar servern med HTTP 401 Unauthorized.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Åtkomst nekad, token saknas!" });
  }

  const token = authHeader.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ error: "Åtkomst nekad, token saknas!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error vid token-verifiering: ", error);
    return res.status(401).json({ error: "Ogiltig token." });
  }
  // Om token är giltig, fortsätter begäran till nästa middleware eller route-handler
  // Om token är ogiltig, svarar servern med HTTP 401 Unauthorized
};

export default authMiddleware;

