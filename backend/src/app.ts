import express from 'express';
import { GameRoutes } from './routes/gameRoutes';

export class App {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Request body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date() });
    });
    
    // API routes
    this.app.use('/api/games', new GameRoutes().getRouter());
    
    // Not found handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || '3000', 10);
  const app = new App(port);
  app.start();
} 