import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODV_URI = process.env.MONGODV_URI;

if (!MONGODV_URI) {
  throw new Error(
    "Please define the MONGODV_URI environment variable inside .env"
  );
}

const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<Mongoose> {
  //return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  //return existing connection promise if one is in progress
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable Mongoose buffering
    };

    //create a new connection promise
    cached.promise = mongoose
      .connect(MONGODV_URI!, options)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    //wait for the connection to establish
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}

export default connectDB;
