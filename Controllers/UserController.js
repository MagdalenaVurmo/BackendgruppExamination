import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, fetchUserByEmail } from "../Models/UserModel.js"



export async function addUser(req, res) {
  try {
    // Kolla om användare redan finns
    const existingUser = await fetchUserByEmail(req.body.email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Den här e-postadress finns redan registrerad" });
    }

    // Hasha lösenordet
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Skapa användarobjekt
    const user = {
      id: uuidv4(),
      email: req.body.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Spara användaren i databasen
    const savedUser = await createUser(user);

    // Felsäkring: Kontrollera att användaren sparades korrekt
    if (!savedUser || !savedUser.id || !savedUser.email) {
      throw new Error("createUser returnerade inte en komplett användare");
    }

    // Ta bort lösenord från svaret (om det råkar vara kvar)
    delete savedUser.password;

    // Skicka tillbaka svar
    return res.status(201).json({
      success: true,
      message: "Användaren skapades",
      data: {
        user: {
          id: savedUser.id,
          email: savedUser.email,
        },
      },
    });


  } catch (err) {
    console.error("Registreringsfel:", err);
    return res.status(500).json({ error: "Kunde inte spara användare" });
  }
}



// login user
export async function loginUser(req, res) {
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

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "Inloggning lyckades",
      data: {
        user: {
          id: user.id,
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
}