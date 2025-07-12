import Datastore from 'nedb-promises';

const usersDB = new Datastore({ filename: './db/users.db', autoload: true });

//Skapa användare
export const createUser = async (user) => {
    return await usersDB.insert(user)
}

//Logga in användare eller jämföra användare vid skapandet av ny
export async function fetchUserByEmail(email) {
    return await usersDB.findOne({ email })
}