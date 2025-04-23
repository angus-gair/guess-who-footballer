import { Router } from 'express';
import { GameController } from '../controllers/gameController';

export class GameRoutes {
  private router: Router;
  private gameController: GameController;

  constructor() {
    this.router = Router();
    this.gameController = new GameController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Game management routes
    this.router.post('/create', this.gameController.createGame.bind(this.gameController));
    this.router.post('/:gameId/join', this.gameController.joinGame.bind(this.gameController));
    this.router.get('/:gameId', this.gameController.getGame.bind(this.gameController));
    this.router.get('/active', this.gameController.getActiveGames.bind(this.gameController));
    
    // Gameplay routes
    this.router.post('/:gameId/select-footballer', this.gameController.selectFootballer.bind(this.gameController));
    this.router.post('/:gameId/ask-question', this.gameController.askQuestion.bind(this.gameController));
    this.router.post('/:gameId/answer-question', this.gameController.answerQuestion.bind(this.gameController));
    this.router.post('/:gameId/eliminate-footballer', this.gameController.eliminateFootballer.bind(this.gameController));
    this.router.post('/:gameId/make-guess', this.gameController.makeGuess.bind(this.gameController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 