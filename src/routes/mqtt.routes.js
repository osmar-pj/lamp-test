import Router from 'express'
const router = Router()

import * as mqttCtrl from '../controllers/mqtt.controller'

router.post('/', mqttCtrl.getMqtt)

export default router