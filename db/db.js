import Datastore from '@seald-io/nedb';
import path from 'path';

export const ordersDB = new Datastore({ // Skapar en databas för ordrar.
    filename: path.resolve('./db/orders.db'),
    autoload: true,
    inMemoryOnly: true
});

export const usersDB = new Datastore({ // Skapar en databas för användare.
    filename: path.resolve('./db/users.db'),  //
    autoload: true
});

