import { userInterface } from '../interfaces/userInterface';
import UserRepository from '../repositories/userRepository';
import Service from '../services/service';
import HttpError from '../utils/httpError';
import jwt from 'jsonwebtoken';

class AuthService extends Service<userInterface> {
 events = null
    async createUser(data: Partial<userInterface>) {
        try {
          const _user = await this.findOne({ email: <string>data.email }).select(
            '+password'
          );
          if (_user) throw new HttpError('user exits', 406);
    
          const verificationToken = (
            Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
          ).toString();
          data.verificationToken = verificationToken;

          const user = await this.create(<userInterface>data);

          const token = user.getSignedToken();

          return { user, token };
        } catch (error: any) {
          throw new Error(error);
        }
      }

}

export default new AuthService(UserRepository);