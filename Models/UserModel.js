import { usersDB } from "../db/db.js";

// Skapa användare
export function createUser(user) {  // createUser-funktionen skapar en ny användare i databasen.
    return new Promise((resolve, reject) => {  // Funktionen returnerar ett nytt Promise-objekt, vilket innebär att du kan använda await 
    // eller .then() när du anropar den.
    // resolve(value) = Anropas om allt gick bra.
    // reject(error) = Anropas om ett fel inträffade.
        usersDB.insert(user, (err, newDoc) => { // Anropar insert-metoden på usersDB för att lägga till en ny användare.
            // usersDB är en databas som innehåller användare.
            if (err) {  // Om något går fel vid inmatningen av användaren, fångas felet här.
                console.error("Fel vid createUser:", err); // Loggar felet till konsolen.   
            }
            resolve(newDoc); // Om allt går bra returneras den sparade användaren (newDoc) via resolve(...).
        });
    });
}

// Hämta användare via e-post
export async function fetchUserByEmail(email) { // Denna funktion hämtar en användare från databasen baserat på deras e-postadress.
    try {
        const user = await usersDB.findOne({ email }); // Hämtar den första användaren som matchar den angivna e-postadressen.
        return user; // och här returneras användaren.
    } catch (err) { // Om något går fel vid hämtning av användaren, fångas felet här.
        console.error("Fel vid fetchUserByEmail:", err); // Loggar felet till konsolen.
        throw err; // Skickar tillbaka felet till den som anropar funktionen.
    }
}
