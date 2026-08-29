import mongoose from "mongoose";

export interface WorkspaceDocument extends Document {
    name: string
    description: string
    owner: mongoose.Types.ObjectId
    inviteCode: string
    createdAt: string
    updatedAt: string
}
const WorkspaceSchema = new <WorkspaceDocument>({
    name: {type: String, required: true, trim: true},
    description: {type: String, required: false},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true,
        default: generateInviteCode
    }
})