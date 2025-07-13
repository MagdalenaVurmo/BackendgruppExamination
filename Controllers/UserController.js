import { userSchema } from "../Middleware/Validation.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, fetchUserByEmail } from "../Models/UserModel.js";

// Skapa användare
export async function addUser(req, res) {
  try {
    const existingUser = await fetchUserByEmail(req.body.email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Den här e-postadress finns redan registrerad" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      id: uuidv4(),
      ...req.body,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const savedUser = await createUser(user);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte spara användare" });
  }

  // skapar token vid registrering
  const token = jwt.sign(
    { id: savedUser.id, email: savedUser.email },
    process.env.JWT_SECRET || "yourSecretKey",
    { expiresIn: "3h" }
  );

  res.status(201).json({
    success: true,
    message: "Användaren skapades",
    data: {
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
      accessToken: token,
      expiresIn: "3h",
    },
  });






}


// Logga in användare
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Ogiltig e-post eller lösenord" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Ogiltig e-post eller lösenord" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "3h" }
    );

    res.json({
      success: true,
      message: "Inloggningen lyckades",
      data: {
        user: {
          id: user.id,
          username: user.name || "",
          email: user.email,
        },
        accessToken: token,
        expiresIn: "3h",
      },
    });
  } catch (error) {
    console.error("Inloggningsfel: ", error);
    res.status(500).json({ error: "Något gick fel vid inloggningen." });
  }
};