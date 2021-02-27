var fs = require('fs');

const mongoose = require('mongoose');
const { Item } = require('./model');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const app = require('https').createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/valinor.tk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/valinor.tk/fullchain.pem'),
}, function (req, res) {
  res.writeHead(200);
  res.end('Hello world\n');
});

const io = require('socket.io')(app, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Connection has been made!');

  const emitUpdate = () => {
    Item.find({}, (err, docs) => {
      io.emit('update', docs);
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

  socket.on('patch', (name, arg) => {
    Item.updateOne({ name }, { '$set': arg }).then(() => emitUpdate());
  });

  socket.on('patchAll', (arg) => {
    Item.updateMany({}, { '$set': arg }).then(() => emitUpdate());
  });
});

app.listen(process.env.PORT);
