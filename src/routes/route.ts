import { Express, Request, Response, Router} from "express";
import Controller from '../controllers/controller';
import { logger } from '../utils/logger';
export default abstract class ClaimsRoute<T> {
  readonly router: Router;
  abstract controller: Controller<T>;
  constructor(
    useAuth = false
    
  ){
    this.router = Router();
  }
  abstract initRoutes(): Router;
}

