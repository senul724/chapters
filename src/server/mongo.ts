import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://chapters:W5WagekasK8OYLZ1@chapters.jufxhcw.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const mongoDB = client.db("Chapters").collection("Content");
export const mongoDBCount = client.db("Chapters").collection("Count");
