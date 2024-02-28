import {model, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import config from 'config';
import { userInterface } from '../interfaces/userInterface';
import jwt from 'jsonwebtoken';

const JWT_KEY = config.get<string>("JWT_KEY");
const JWT_TIMEOUT = config.get<number>("JWT_TIMEOUT")


const userSchema = new Schema<userInterface>({
  firstName:{type:String, required: true},
  lastName:{type:String, required: true},  
  email: {type: String, required: true, unique: true},
  password:{type:String, required: true, min:6},
  studentNumber:{type:String, required: true},
  isVerified:{type:String, default: false},
  avatar:{type:String},
  totalContributions: { type: Number, default: 0 },
  totalResources:{type:Number, default: 0},
  resetToken: String,
  verificationToken: String

},{
    timestamps: true
})

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, JWT_KEY, { expiresIn: JWT_TIMEOUT });
};

const User = model("User", userSchema);

export default User