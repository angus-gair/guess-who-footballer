import dotenv from 'dotenv';
// Load environment variables before other imports
dotenv.config();

import { createServer } from 'http';
import app from './app';
import { setupSocketIO } from './socket';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
setupSocketIO(server);

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
}); 