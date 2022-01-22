//User model for database
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname : {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
})


export interface IUser extends mongoose.Document {
    _id: string;
    name: string; 
    surname: string;
    userName: string;
    password: string;
    token?: string;
  };

  
const User = mongoose.model<IUser>('User', userSchema);
 
export default User


