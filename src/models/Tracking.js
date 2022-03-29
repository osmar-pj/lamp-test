import { Schema, model } from 'mongoose'
import timezone from 'mongoose-timezone'

const trackingSchema = new Schema(
    {
        tracking: [
            {
                id_wap: {
                    type: Schema.Types.ObjectId,
                    ref: 'Wap'
                },
                tags: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: 'Tag'
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
)

trackingSchema.plugin(timezone)
export default model('Tracking', trackingSchema)