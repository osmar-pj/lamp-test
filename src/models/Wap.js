import { Schema, model } from "mongoose";
import timezone from 'mongoose-timezone'

const wapSchema = new Schema(
  {
    ap_mac: {
      type: String,
      unique: true
    },
    ip: String,
    ubication: String,
    name: String,
    cx: Number,
    cy: Number,
    mac_min: String,
    state: Boolean
  },
  {
    timestamps: true,
    versionKey: false
  }
);

wapSchema.plugin(timezone)
export default model("Wap", wapSchema);
