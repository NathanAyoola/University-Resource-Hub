import { SessionInterface } from '../interfaces/sessionInterface';
import Session from '../models/sessionModel';
import Repository from '../repositories/repository';

class SessionRepository extends Repository<SessionInterface> {
  //   private model = Session;
}

export default new SessionRepository(Session);