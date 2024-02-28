import { SessionInterface } from '../interfaces/sessionInterface';
import SessionRepository from '../repositories/sessionRepository';
import Service from '../services/service';

class SessionService extends Service<SessionInterface> {
  events = null;
  externalServices = null;
}

export default new SessionService(SessionRepository);