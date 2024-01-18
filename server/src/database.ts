import { MongoClient } from "mongodb";

async function connectDB() {
  const client: MongoClient = new MongoClient(process.env.DATABASE!!);

  try {
    await client.connect();
    return client;
  } catch (err: any) {
    console.error(err.message);
    return undefined
  }
}

async function getCollection(collectionName: string) {
  try {
    const client = await connectDB();
    if (!client) throw new Error("Could not instantiate client");
    const DB = client.db();
    const collection = DB.collection(collectionName);
    return collection;
  } catch (err: any) {
    console.log(err);
    return undefined
  }
}

enum Collections {
  USERS = "users",
  TRANSACTIONS = "transactions",
}

module.exports = { connectDB, getCollection, Collections };
