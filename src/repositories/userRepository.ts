import { userInterface } from '../interfaces/userInterface';
import User from '../models/userModel';
import Repository from '../repositories/repository';

class UserRepository extends Repository<userInterface> {
  //   private model = User;
}

export default  new UserRepository(User);