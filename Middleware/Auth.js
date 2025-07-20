// Auth.js Skydda rutter från obehörig åtkomst. Skicka tillbaka fel om något är fel.

import jwt from "jsonwebtoken";
 

// Den kontrollerar om en inkommande begäran (request) innehåller en giltig JWT-token i Authorization-huvudet. 
// Om token saknas eller är ogiltig, blockeras begäran. Om den är giltig, får begäran gå vidare



// Letar efter Authorization-huvudet. Om det saknas, svarar servern med HTTP 401 Unauthorized.Ett felmeddelnade skickas till kunden.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Åtkomst nekad, token saknas!" });
  }

  const token = authHeader.split(" ")[1]; // Den här raden försöker extrahera själva tokenen från Authorization-headern i HTTP-förfrågan.   
  if (!token) { // Om token saknas, svarar servern med HTTP 401 Unauthorized.
    return res.status(401).json({ error: "Åtkomst nekad, token saknas!" }); // Felmeddelande skickas till kunden.
  }

  try { //Startar ett try-block för att fånga fel, tex om tokenen är ogiltig eller saknas.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey"); // Den här raden verifierar tokenen med den hemliga nyckeln. 
    // Om token är giltig, returneras den avkodade informationen.
    req.user = decoded; // Lagrar den avkodade tokeninformationen i req.user.
    next(); // Om allt gått bra (tokenen är giltig), anropas next() för att gå vidare till nästa middleware eller route-handler.
  } catch (error) { //Om något gick fel i try-blocket (t.ex. tokenen är fel, har gått ut, eller är manipulerad) fångas felet här.
    console.error("Error vid token-verifiering: ", error); // Loggar felet till serverns konsol, så att utvecklare kan felsöka vad som gick snett.
    return res.status(401).json({ error: "Ogiltig token." }); // Skickar ett felmeddelnade till kunden. 
  }
};

export default authMiddleware;

