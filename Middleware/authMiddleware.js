import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Ingen eller ogiltig token" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Error vid token-verifiering: ", err);
        return res.status(401).json({ error: "Ogiltig token" });
    }
};
