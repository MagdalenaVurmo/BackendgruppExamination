import jwt from "jsonwebtoken";

// Den här koden är en middleware-funktion i en Node.js/Express-applikation 
// för att autentisera användare via JSON Web Tokens (JWT). 
// Den används för att skydda rutter så att bara inloggade (autentiserade) användare kan få åtkomst.
export const authMiddleware = (req, res, next) => {

// Skapar och exporterar en middleware-funktion.
// Den tar emot tre argument:
// req: HTTP-request från klienten.
// res: HTTP-svar som skickas tillbaka till klienten.
// next: En funktion som kör nästa middleware i kedjan (om allt är OK).
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Ingen eller ogiltig token" });
    } // Kontrollerar om Authorization-headern finns och börjar med "Bearer ".
    // Om den inte gör det, då returneras ett 401 Unauthorized-fel med ett meddelande om "Ingen eller ogiltig token".

    const token = authHeader.split(" ")[1]; 
    try { // Startar en try/catch-block för att hantera eventuella fel vid tolkning av token.
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey"); // Verifierar token med en hemlig nyckel (JWT_SECRET) som är lagrad i miljövariabler eller en standardnyckel.
        
        req.user = decoded; // MEN om token är giltig, då dekrypteras den och användardata kommer då att lagras
        next();    // Fortsätter till nästa middleware eller route handler.
                    // OBS!! Endast om token är giltig.
                    // Om token är giltig, då kommer användardata att lagras i req.user och nästa middleware kommer att köras.


    } catch (err) {  // Fångar upp fel ifrån Token. Om fel kommer upp på vägen.
        console.error("Error vid token-verifiering: ", err);
        return res.status(401).json({ error: "Ogiltig token" });
    }
};
