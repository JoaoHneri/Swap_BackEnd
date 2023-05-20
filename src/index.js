const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set("strictQuery", false);

const cors = require('cors')
const router = require('./Routes/Router')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {cors: {origin: 'https://swap-book.vercel.app/'}})

const dbUri = process.env.DB_URI;

mongoose.connect(
  dbUri,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  () => console.log('Connected to database')
)

io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id)
  })

  socket.on('set_username', username => {
    socket.data.username = username
  })

  socket.on('message', text => {
    io.emit('receive_message', {
      text, 
      authorId: socket.id,
      author: socket.data.username
    })
  })
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));

app.use(router)

server.listen(3333, () => console.log('Server running on port 3333'))
