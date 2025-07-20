import { userSchema } from "../Middleware/Validation.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, fetchUserByEmail } from "../Models/UserModel.js"



export async function addUser(req, res) { // Denna funktion skapar en ny användare i databasen.
  // req: Inkommande request, innehåller info om t.ex. vilka rutter som anropas.
  // res: Svar som skickas tillbaka till klienten.
  try {
    // Kolla om användare redan finns
    const existingUser = await fetchUserByEmail(req.body.email); // Hämtar användaren från databasen baserat på e-postadressen.
    
    if (existingUser) { // Om användaren redan finns, returnera ett felmeddelande.
      return res // skickar tillbaka ett felmeddelande med status 409.
        .status(409) // 409 betyder att resursen (e-posten) redan finns.
        .json({ error: "Den här e-postadress finns redan registrerad" }); // Skickar tillbaka ett felmeddelande tillbaka till klienten.
    }

    // Hasha lösenordet
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // krypterar lösenorden med bcrypt. 10 är salt-runden som används för att göra lösenordet säkrare.

    // Skapa användarobjekt
    const user = { // Här skapas själva användarobjektet med all information.
      id: uuidv4(),// uuidv4() gör ett unikt id för användaren.
      email: req.body.email, // Hämtar e-postadressen som användaren skickade i sin förfrågan.
      password: hashedPassword, // Här sparas det hashade/krypterade lösenordet.
      createdAt: new Date().toISOString(), //Den här sparar datumet och tiden när användaren skapades.
    };

    
    const savedUser = await createUser(user); // Här skapas användaren i databasen, genom att anropa createUser-funktionen från UserModel.js.

   
    if (!savedUser || !savedUser.id || !savedUser.email) { // Om createUser inte returnerar en komplett användare, då skickas ett fel.
      // savedUser är falsy, vilket betyder att det inte finns någon användare sparad i databasen.
      // savedUser.id och savedUser.email är falsy (null, undefined, false.), vilket betyder att de inte finns i det sparade användarobjektet.
      throw new Error("createUser returnerade inte en komplett användare"); // 
    }

    // Skapa JWT-token 
    // Token används för att verifiera att användaren är den som de säger att de är
    const token = jwt.sign( // Här skapas en JWT-token som används för att autentisera användaren.
      { id: savedUser.id, email: savedUser.email }, // Innehåller användarens id och e-postadress.
                                            // Den här token innehåller användarens id och e-postadress, och den är signerad med en hemlig nyckel.

      process.env.JWT_SECRET || "yourSecretKey",// process.env.JWT_SECRET är en miljövariabel som innehåller den hemliga nyckeln för att signera token.
                                                // Om den inte är satt, används en standardnyckel "yourSecretKey".
      { expiresIn: "3h" } // Token kommer att vara giltig i 3 timmar. Efter det måste användaren logga in igen för att få en ny token.
    );

    delete savedUser.password; // Tar bort lösenordet från det sparade användarobjektet innan det skickas tillbaka till klienten.

    // Skicka tillbaka svar
    return res.status(201).json({ // Skickar tillbaka ett svar med status 201.
      // 201 betyder att resursen (användaren) skapades utan problem.
      success: true, // Säger till att användaren skapades korrekt.
      message: "Användaren skapades", // Meddelar att användaren skapades.
      
      data: {// Skickar tillbaka användarens id och e-postadress, samt token och dess giltighetstid.
        user: {
          id: savedUser.id, // Användarens unika id.
          email: savedUser.email, // Användarens e-postadress.
        },
        accessToken: token, // JWT-token som används för att autentisera användaren.
        expiresIn: "3h", // Token kommer att vara giltig i 3 timmar.
      },
    });


  } catch (err) { // Fångar upp eventuella fel som kan uppstå under processen.
    console.error("Registreringsfel:", err); 
    return res.status(500).json({ error: "Kunde inte spara användare" }); 
  }// Skickar tillbaka ett felmeddelande till klienten med status 500.
}



// login user
export async function loginUser(req, res) { // Denna funktion loggar in en användare.
  // Denna funktion loggar in en användare genom att verifiera e-post och lösenord.
  // req: Inkommande request, innehåller info om t.ex. vilka rutter som anropas.
  // res: Svar som skickas tillbaka till klienten.
  
 
  
  const { email, password } = req.body; // Hämtar e-post och lösenord från requestens body.
  try { // Försöker logga in användaren med den angivna e-postadressen och lösenordet.
    const user = await fetchUserByEmail(email); // Hämtar användaren från databasen baserat på e-postadressen.
    if (!user) { // Om användaren inte finns, returneras ett felmeddelande.
      return res.status(401).json({ error: "Ogiltig e-post eller lösenord" });// Om inloggningen misslyckas, returneras ett felmeddelande
    }

    const isMatch = await bcrypt.compare(password, user.password); //Den jämför det angivna lösenordet med det hashade/krypterade lösenordet i databasen.
    if (!isMatch) // Om lösenorden inte matchar, då skickas ett felmeddelande.
      return res.status(401).json({ error: "Ogiltig e-post eller lösenord" });


    const token = jwt.sign( // Här skapas en JWT-token som används för att autentisera användaren.
      { id: user.id, email: user.email }, // Innehåller användarens id och e-postadress.
      process.env.JWT_SECRET || "yourSecretKey", // process.env.JWT_SECRET är en miljövariabel som innehåller den hemliga nyckeln för att signera token.
      // Om den inte är satt, används en standardnyckel "yourSecretKey".
      { expiresIn: "3h" } // Token kommer att vara giltig i 3 timmar. Efter det måste användaren logga in igen för att få en ny token.
    );

    delete user.password; // Den här tar bort lösenordet från användarobjektet innan det skickas tillbaka till klienten.

    return res.status(200).json({ // Skickar tillbaka ett svar med status 200.
      // 200 betyder att inloggningen lyckades.
      success: true, 
      message: "Inloggning lyckades", // Meddelar att inloggningen lyckades.
      // Skickar tillbaka användarens id och e-postadress, samt token och dess
      data: {
        user: { 
          id: user.id, // Användarens unika id.
          email: user.email, // Användarens e-postadress.
        },
        accessToken: token, // JWT-token som används för att autentisera användaren.
        expiresIn: "3h", // Token kommer att vara giltig i 3 timmar.
      },
    });

  } catch (error) { // Den här fångar upp eventuella fel som kan uppstå under inloggningsprocessen.
    console.error("Inloggningsfel: ", error); 
    res.status(500).json({ error: "Något gick fel vid inloggningen." }); // Skickar tillbaka ett felmeddelande till klienten.
  }
}