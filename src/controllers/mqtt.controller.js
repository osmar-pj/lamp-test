import mqtt from 'mqtt'

export const getMqtt = async (req, res) => {
    try {
      console.log(req.body)
        const led = req.body.status
        const options = {
            clientId: 'API-MQTT-TEST'
          }
          const connectUrl = 'ws://143.198.128.180:8083/mqtt'
          const client = mqtt.connect(connectUrl, options)
          client.on('connect', () => {
            console.log('Client connected by API:')
            // Subscribe
          })
          client.publish('mina/subterranea/worker/alarm', led.toString())
          
        return res.json(led)
    } catch (error) {
        return res.status(500).json(error)
    }
}