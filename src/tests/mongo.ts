import { MongoClient } from 'mongodb';

// MongoDB connection URL
const url = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'mydatabase';
const collectionName = 'mycollection';

// Example document to insert
const document = { name: 'John Doe', age: 30 };

async function connectAndOperate() {
  // Connect to MongoDB
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Access the collection
    const collection = db.collection(collectionName);

    // Insert the document
    await collection.insertOne(document);
    console.log('Document inserted successfully.');

    // Read the inserted document
    const insertedDocument = await collection.find();
    console.log('Inserted document:', insertedDocument);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    client.close();
  }
}

// Call the connectAndOperate function to start the operations
connectAndOperate();
