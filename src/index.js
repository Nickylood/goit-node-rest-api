import 'dotenv/config';
import { setupServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

// import { startServer } from './server';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

// const startServer = async () => {
//     try {
//         console.log('successful startServer');
//         await initMongoConnection();
//         setupServer();
//     }catch(error){
//         console.error('Failed to start the server:', error);
//     }
// };

// startServer();

// startServer();

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();
