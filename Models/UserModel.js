import { usersDB } from "../db/db.js";

// Skapa användare
export function createUser(user) {
    return new Promise((resolve, reject) => {
        usersDB.insert(user, (err, newDoc) => {
            if (err) {
                console.error("Fel vid createUser:", err);
                return reject(err);
            }
            resolve(newDoc);
        });
    });
}

// Hämta användare via e-post
export async function fetchUserByEmail(email) {
    try {
        const user = await usersDB.findOne({ email });
        return user;
    } catch (err) {
        console.error("Fel vid fetchUserByEmail:", err);
        throw err;
    }
}
