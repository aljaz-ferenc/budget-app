import { MongoClient } from "mongodb";

export async function connectDB() {
  const client: MongoClient = new MongoClient(process.env.DATABASE!!);

  try {
    await client.connect();
    return client;
  } catch (err: any) {
    console.error(err.message);
    return undefined
  }
}

export async function getCollection(collectionName: string) {
  try {
    const client = await connectDB();
    if (!client) throw new Error("Could not instantiate client");
    const DB = client.db();
    const collection = DB.collection(collectionName);
    return collection;
  } catch (err: any) {
    console.log(err);
    throw new Error(`Collection not found: ${err.message}`)
  }
}

export enum Collections {
  USERS = "users",
  TRANSACTIONS = "transactions",
}

// module.exports = { connectDB, getCollection, Collections };
