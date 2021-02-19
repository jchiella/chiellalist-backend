const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { Item } = require('./model');

const app = express();

require('dotenv').config();
app.use(cors());

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

app.post('/item', (req, res) => {
  Item.create({
    name: req.query.name,
    category: req.query.category,
    done: false,
  });
  res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});