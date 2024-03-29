const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3'; // Update with your MongoDB connection string
const dbName = 'main'; // Update with your database name

let client;

async function connectToDatabase() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to the mongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to the mongoDB', error);
    throw error;
  }
}

function closeDatabaseConnection() {
  if (client) {
    client.close();
    console.log('Disconnected from the mongoDB');
  }
}

async function insert(collectionName, document) {
  //connect to the database
  const db = await connectToDatabase();
  //get the collection
  const collection = db.collection(collectionName);

  //insert the document into the collection
  const result = await collection.insertOne(document);
  closeDatabaseConnection();
  //return the id of the new document created as a string
  return result.insertedId.toString();
}

async function find(collectionName, idString) {
  //Connect to database
  const db = await connectToDatabase();
  //Get collection
  const collection = db.collection(collectionName);

  // Convert the string ID to ObjectId
  let objectId
  try {
    objectId = new ObjectId(idString);
  } catch (error) {
    closeDatabaseConnection();
    return null;
  }

  const result = await collection.findOne(objectId);
  closeDatabaseConnection();
  return result;
}

async function remove(collectionName, idString) {
  //Connect to database
  const db = await connectToDatabase();
  //Get the collection
  const collection = db.collection(collectionName);

  // Convert the string ID to ObjectId
  let objectId
  try {
    objectId = new ObjectId(idString);
  } catch (error) {
    closeDatabaseConnection();
    return null;
  }

  //Delete the record with the given id
  const result = await collection.deleteOne({_id: objectId});
  //close the connection
  closeDatabaseConnection();
  return result;
}

async function removeAll(collectionName, binId) {
  //Connect to database
  const db = await connectToDatabase();
  //Get the collection
  const collection = db.collection(collectionName);

  //Delete the record with the given id
  const result = await collection.deleteMany({ bin_id: binId });
  //close the connection
  closeDatabaseConnection();
  return result;
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  insert,
  find,
  remove,
  removeAll
};
