import authController from '../controllers/authController';
import Route from '../routes/route';
import { userInterface } from '../interfaces/userInterface';
import { Router } from 'express';

class AuthRoute extends Route<userInterface> {
    controller = authController;
    initRoutes() {
       this.router
       .route('/signup')
       .post(this.controller.registration);
       this.router
       .route('/signin')
       .post(this.controller.login)


       return this.router;
    }
}

export default new AuthRoute();