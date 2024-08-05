import mongoose from 'mongoose';

const initMongoConnection = async () => {
  try {
    const DB_URI = process.env.DB_URI;

    await mongoose.connect(DB_URI);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default initMongoConnection;

