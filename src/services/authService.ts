import { userInterface } from '../interfaces/userInterface';
import UserRepository from '../repositories/userRepository';
import Service from '../services/service';
import SessionService from '../services/sessionService';
import HttpError from '../utils/httpError';
import config from 'config';
import Emailing from '../helpers/emailing';
import generateToken from '../helpers/generateToken';



const USE_REFRESH_TOKEN = config.get<Boolean>("USE_REFRESH_TOKEN");

class AuthService extends Service<userInterface> {
 events = null
 externalServices = {
    SessionService,
    Emailing
  };

  userRefreshToken = USE_REFRESH_TOKEN;

    async createUser(data: Partial<userInterface>) {
        try {
          const _user = await this.findOne({ email: <string>data.email }).select(
            '+password'
          );
          if (_user) throw new HttpError('user exits', 406);
    
          const verificationToken = generateToken()
          console.log(verificationToken)
          data.verificationToken = verificationToken;

          const user = await this.create(<userInterface>data);
          this.externalServices.Emailing.verifyEmail(user.email, data.verificationToken);
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
      };

      async verifyEmail(token: string) {
      
        try {
            console.log(token);
          const user = await this.findOne({
            verificationToken: token
          });
        
          if (!user) throw new HttpError('No user found', 406);
    
          user.verifiedEmail = true;
          user.verificationToken = undefined;
          const result = await user.save();
          return result;
        } catch (error: any) {
            console.log(error)
          throw new Error(error);
        }
      };

      async getResetToken(email: string) {
        try {
          const user = await this.findOne({ email });
          if (!user) throw new HttpError('cannot find user', 404);
          user.resetToken = generateToken()
          await user.save();
    
          this.externalServices.Emailing.sendResetPassword(user.email, user.resetToken);
        } catch (error: any) {
          throw new Error(error);
        }
      }  

      async resetPassword(token: string, password: string) {
        try {
          const user = await this.findOne({ resetToken: token }).select(
            '+password'
          );
    
          if (!user) throw new HttpError('User not found', 404);
          user.password = password;
          user.resetToken = undefined;
          await user.save();
          return true;
        } catch (error: any) {
          throw new Error(error);
        }
      }
}

export default new AuthService(UserRepository);