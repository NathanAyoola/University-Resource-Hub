export interface userInterface{
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    studentNumber:string,
    verifiedEmail: boolean;
    isVerified:Boolean,
    verificationToken?: string;
    resetToken?: string;
    totalContributions:Number,
    totalResources:Number,
    avatar?:string,
    createdAt: Date,
    updatedAt: Date,
    comparePasswords(password: string): Promise<Boolean>
    getSignedToken(): string;
  }