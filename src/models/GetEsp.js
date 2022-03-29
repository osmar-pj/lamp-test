import { Schema, model } from 'mongoose'
import timezone from 'mongoose-timezone'

const getEspSchema = Schema(
    {
        rssi: Number,
        ip_tag: String,
        tag_mac: {
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        },
        ap_mac: {
            type: Schema.Types.ObjectId,
            ref: 'Wap'
        },
        delay: Number
    },
    {
        timestamps: true
    }
)

getEspSchema.plugin(timezone)
export default model('Getesp', getEspSchema)