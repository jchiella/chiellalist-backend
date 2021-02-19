const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Item } = require('./model');

const app = express();

require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.get('/', (req, res) => {
  res.send('Hello world from the chiella list backend!');
});

app.get('/item', (req, res) => {
  Item.find((err, docs) => {
    res.json(docs);
  });
});

app.put('/item', async (req, res) => {
  console.log(req.body);
  await Item.create(req.body);
  res.sendStatus(200);
});

app.delete('/item', async (req, res) => {
  console.log(req.body);
  await Item.deleteOne(req.body);
  res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});