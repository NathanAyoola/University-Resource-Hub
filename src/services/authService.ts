import { userInterface } from '../interfaces/userInterface';
import UserRepository from '../repositories/userRepository';
import Service from '../services/service';
import SessionService from '../services/sessionService';
import HttpError from '../utils/httpError';
import config from 'config';



const USE_REFRESH_TOKEN = config.get<Boolean>("USE_REFRESH_TOKEN");

class AuthService extends Service<userInterface> {
 events = null
 externalServices = {
    SessionService,
  };

  userRefreshToken = USE_REFRESH_TOKEN;

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


      async login(data: { email: string; password: string }) {
        try {
          const user = await this.findOne({ email: <string>data.email }).select(
            '+password'
          );
          if (!user) throw new HttpError('cannot find user', 401);
          const isMatch = await user.comparePasswords(data.password);

          if (!isMatch) throw new HttpError('Wrong email or password', 401);
          const token = user.getSignedToken();
    
          // create a session
          let session = await this.externalServices.SessionService.findOne({
            userId: user._id
          });
          if (session) this.externalServices.SessionService.delete(session.id);
          session = await this.externalServices.SessionService.create({
            userId: user._id,
            token,
            isLoggedIn: true
          });
          let refreshToken;
          if (this.userRefreshToken) {
            refreshToken = session.getRefreshToken!();
          }
          return { token, user, refreshToken };
        } catch (error: any) {
          throw new Error(error);
        }
      }

}

export default new AuthService(UserRepository);