import { Schema, model } from "mongoose";
import timezone from 'mongoose-timezone'

const winexSchema = new Schema(
  {
    power_status: Boolean
  },
  {
    timestamps: true,
    versionKey: false
  }
);

winexSchema.plugin(timezone)
export default model("Winex", winexSchema);