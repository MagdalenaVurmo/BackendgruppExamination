import Datastore from '@seald-io/nedb';
import path from 'path';

// Skapar en databas för ordrar.
export const ordersDB = new Datastore({ // Denna databas används för att lagra ordrar.
    filename: path.resolve('./db/orders.db'), // Filen som databasen kommer att lagras i.
    autoload: true, // Autoload betyder att databasen automatiskt laddas när appen startar.
    inMemoryOnly: true // InMemoryOnly betyder att databasen endast kommer att lagras i minnet och inte på disk.
});
// Skapar en databas för användare.
export const usersDB = new Datastore({ // Den här databas används för att lagra användare.
    filename: path.resolve('./db/users.db'),  // Filen som databasen kommer att lagras i.
    autoload: true // Autoload betyder att databasen automatiskt laddas när appen startar.
});

