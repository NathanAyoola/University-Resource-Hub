import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import { userInterface } from '../interfaces/userInterface';
import Controller from '../controllers/controller';
import { logger } from '../utils/logger';
import safeQuery from '../utils/safeQuery';



interface CustomRequest extends Request {
    user: {
        _id: string; 
    };
}

class AuthController extends Controller<userInterface> {
    service = userService;

    getOne = async (req: Request , res: Response, next: NextFunction) => {
        try {
          const id = req['params'][this.resourceId] || (req as CustomRequest).user._id;
    
          const result = await this.service.findOne(id);
          if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
          this.HttpResponse.send(res, result);
        } catch (error) {
          logger.error([error]);
          next(error);
        }
      };

      update = async (req: Request, res: Response, next: NextFunction) => {
        try {
          this.processFiles(req);
          const id = req['params'][this.resourceId] || (req as CustomRequest).user._id;
          const result = await this.service.update(id, req['body']);
    
          if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
          this.HttpResponse.send(res, result);
        } catch (error) {
          logger.error([error]);
          next(error);
        }
      };  
      
      // uploadImage = async (req: Request, res: Response, next: NextFunction) => {
      //   try {
      //     const result = await Promise.all(
      //       req.body.files.map(
      //         (file: { contentType: string; base64file: string }) =>
      //           this.multer.uploadOne.bind(file.base64file, file.contentType)
      //       )
      //     );
      //     logger.info([result]);
      //     this.HttpResponse.send(res, result);
      //   } catch (error) {
      //     logger.error([error]);
      //     next(error);
      //   }
      // };

}   


export default new AuthController('user');
