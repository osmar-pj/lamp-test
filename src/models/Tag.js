import { Schema, model } from "mongoose"
import timezone from 'mongoose-timezone'

const tagSchema = new Schema(
    {
        tag_mac: {
            type: String,
            unique: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        esp: String
    },
    {
        timestamps: true
    }
)

tagSchema.plugin(timezone)
export default model('Tag', tagSchema)