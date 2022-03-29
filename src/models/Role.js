import { Schema, model } from "mongoose";
import timezone from 'mongoose-timezone'

export const ROLES = ["user", "admin", "moderator"];

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

roleSchema.plugin(timezone)
export default model("Role", roleSchema);
