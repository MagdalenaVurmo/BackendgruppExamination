import Datastore from '@seald-io/nedb';
import path from 'path';

export const ordersDB = new Datastore({
    filename: path.resolve('./db/orders.db'),
    autoload: true,
    inMemoryOnly: true
});

export const usersDB = new Datastore({
    filename: path.resolve('./db/users.db'),
    autoload: true
});

