import { Request, Response, NextFunction } from 'express';
import HttpResponse from '../utils/httpResponse';
import authService from '../services/authService';
import { userInterface } from '../interfaces/userInterface';
import Controller from '../controllers/controller';

class AuthController extends Controller<userInterface> {
    service = authService;

  registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this.service.createUser(req.body);
          HttpResponse.send(res, result);
        } catch (error) {
          next(error);
        }
      };

}



export default new AuthController('user');