import userController from '../controllers/userController';
import Route from './route';
import { userInterface } from '../interfaces/userInterface';
import multer from '../helpers/multer';




class UserRoute extends Route<userInterface> {
    controller = userController;
    multer = multer
    initRoutes() {
      this.router.get('/', this.controller.get);
      this.router
      .route('/me')
      .put(
        this.multer.uploadOne.bind(multer),
        this.controller.update
      )
      .get( this.controller.getOne);
      this.router
      .route('/:userId')
      .delete( this.controller.delete)
      .get(this.controller.getOne)
      .put(
        this.multer.uploadOne.bind(multer),
        this.controller.update
      );


      return this.router;
    }
}   

export default new UserRoute();