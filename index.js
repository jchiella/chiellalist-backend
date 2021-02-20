const mongoose = require('mongoose');
const { emit } = require('nodemon');
const { Socket } = require('socket.io');
const { Item } = require('./model');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const io = require('socket.io')({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log('Connection has been made!');

  const emitUpdate = () => {
    Item.find({}, (err, docs) => {
      socket.emit('update', docs);
    });
  };

  socket.on('hello', () => {
    console.log('Recieved hello from client!');
    emitUpdate();
  });

  socket.on('put', (arg) => {
    Item.create(arg).then(() => emitUpdate());
  });

  socket.on('delete', (arg) => {
    Item.deleteOne(arg).then(() => emitUpdate());
  });

  socket.on('patch', (arg) => {
    Item.updateOne({ name: arg.name }, arg).then(() => emitUpdate());
  })

});

io.listen(process.env.PORT);