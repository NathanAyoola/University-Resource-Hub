import { userInterface } from '../interfaces/userInterface';
import UserRepository from '../repositories/userRepository';
import Service from '../services/service';
import { logger } from '../utils/logger';


class UserService extends Service<userInterface> {
  events = null;
}

export default new UserService(UserRepository);