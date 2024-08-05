import 'dotenv/config';
import { setupServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

const startServer = async () => {
  try {
    console.log('successful startServer');
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
