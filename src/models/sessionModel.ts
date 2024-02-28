import { SessionInterface } from '../interfaces/sessionInterface';
import { model, Schema, Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';

const REFRESH_JWT_KEY = config.get<string>("REFRESH_JWT_KEY");
const REFRESH_JWT_TIMEOUT = config.get<number>("REFRESH_JWT_TIMEOUT")

const sessionSchema = new Schema<SessionInterface>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, required: [true, 'The token is required'] },
    isLoggedIn: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);
sessionSchema.methods.getRefreshToken = function () {
  // eslint-disable-next-line no-underscore-dangle
  return jwt.sign({ id: this._id }, REFRESH_JWT_KEY, { expiresIn: REFRESH_JWT_TIMEOUT });
};

export default <Model<SessionInterface>>model('session', sessionSchema);