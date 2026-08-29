import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt.js";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    profilePicture?: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: mongoose.Types.ObjectId | null;

    comparePassword(value: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            select: true,
        },

        profilePicture: {
            type: String,
            default: null,
        },

        currentWorkspace: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    if (this.password) {
        this.password = await hashValue(this.password);
    }

    next();
});

// Remove password from returned user object
userSchema.methods.omitPassword = function () {
    const userObject = this.toObject();

    delete userObject.password;

    return userObject;
};

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (
    value: string
): Promise<boolean> {
    if (!this.password) {
        return false;
    }

    return compareValue(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;