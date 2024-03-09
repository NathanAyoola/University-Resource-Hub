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

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this.service.login(req.body);
          HttpResponse.send(res, result);
        } catch (error) {
          next(error);
        }
      };

      verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await authService.verifyEmail(req.params.token);
          HttpResponse.send(res, { message: 'user verified', user: result });
        } catch (error) {
          next(error);
        }
      };
    
      forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await authService.getResetToken(req.body.email);
          HttpResponse.send(res, { message: 'email sent', data: result });
        } catch (error) {
          next(error);
        }
      }; 
      
      resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await authService.resetPassword(
            req.params.token,
            req.body.password
          );
          HttpResponse.send(res, { success: result });
        } catch (error) {
          next(error);
        }
      };
}



export default new AuthController('user');