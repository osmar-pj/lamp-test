import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mqtt from 'mqtt'


import { createServer } from 'http'

// import Routes
import mqttRoutes from './routes/mqtt.routes'

const app = express();

// config sockets
const server = createServer(app)
const io = require('socket.io')(server)

// createRoles();
//createAdmin(); // para mejorar el codigo del weon de fazt

// Settings
app.set("port", process.env.PORT || 4000);

// Middlewares
const corsOptions = {
  // origin: "http://localhost:3000"
};
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Welcome Routes
app.use('/api/mqtt', mqttRoutes)
// Sockets
let USERS = {}
let alarm = {}

io.on("connection", (socket) => {
  console.log(`${socket.id} was connected`)
  USERS[socket.id] = socket

  socket.on('disconnect', () => {
    console.log(`${socket.id} was disconnected`)
  })
})

// Connection option
const options = {
  clean: true, // Retain connection
  connectTimeout: 4000, // Timeout
  clientId: 'TEST_APRC'
}

const connectUrl = 'ws://143.198.128.180:8083/mqtt'
const client = mqtt.connect(connectUrl, options)
client.on('connect', () => {
  console.log('Client connected by APP:')
  // Subscribe
  client.subscribe('mina/subterranea/worker/#', { qos: 0 })
})

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString())
  console.log(data)
  if (data.alarm) {
    alarm = data.alarm
    for (let i in USERS) {
      USERS[i].emit('alarm', alarm)
    }
  }
})

server.listen(4000, () => {
  console.log('server is ok')
})

export default app