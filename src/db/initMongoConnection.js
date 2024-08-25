import mongoose from 'mongoose';

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default initMongoConnection;
