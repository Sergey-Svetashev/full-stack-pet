import { MongoClient } from "mdb";

const MDB_PASS = Deno.env.get("MDB_PASS");
const MDB_LOGIN = Deno.env.get("MDB_LOGIN");
const MDB_CONNECTION_PATH = Deno.env.get("MDB_CONNECTION_PATH");

const mdbUrl = `mongodb+srv://${MDB_LOGIN}:${MDB_PASS}${MDB_CONNECTION_PATH}`;
const client = new MongoClient(mdbUrl);

export const db = client.db()
