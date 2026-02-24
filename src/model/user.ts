import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}


const MessageSchema = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User' , index: true}
});

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
        unique: true, // Added this!
    },
    email: {
        type: String,
        required: [true , "Email is required"],
        unique: true, // Added this!
    },
    password: {
        type: String,
        // required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        // required: [true, "Verify Code is required"],
    },
    verifyCodeExpires: {
        type: Date,
        // required: [true, "Verify Code Expiration is required"],
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