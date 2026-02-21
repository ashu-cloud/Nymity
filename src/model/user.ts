import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true , "Username is required"],
    },
    email: {
        type: String,
        required: [true , "Email is required"],
    },
    password: {
        type: String,
        unique: true,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
    },
    messages: [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User>|| mongoose.model<User>("User", UserSchema);
export default UserModel;