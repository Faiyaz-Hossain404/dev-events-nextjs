import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

//extentd the global object to include mongoose cache
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

//initializing the mongoose cache on the global object to persist across hot reloads in development
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB(): Promise<Mongoose> {
  //return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  //return existing connection promise if one is in progress
  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
      );
    }
    const options = {
      bufferCommands: false, //disable Mongoose buffering
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    //create a new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log("MongoDB Connected ✅");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB Connection Error ❌:", err);
        throw err;
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
