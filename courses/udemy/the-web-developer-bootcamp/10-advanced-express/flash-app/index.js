const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = 3000;
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
  secret: 'thisisnotagoodsecret',
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(flash());

const Farm = require('./models/farm');

mongoose
  .connect('mongodb://localhost:27017/farmStand3')
  .then(() => console.log('Mongo Connection Open!!!'))
  .catch(err => {
    console.log('Oh No, Mongo Connection Error!');
    console.log(err);
  });
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// FARM ROUTES
app.use((req, res, next) => {
  res.locals.messages = req.flash('success');
  next();
});

app.get('/farms', async (req, res) => {
  const farms = await Farm.find({});
  res.render('farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
  res.render('farms/new');
});

app.post('/farms', async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  req.flash('success', 'Successfully made a new farm!');
  res.redirect('/farms');
});

app.get('/farms/:id', async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate('products');
  res.render('farms/show', { farm });
});

app.delete('/farms/:id', async (req, res) => {
  const farm = await Farm.findByIdAndDelete(req.params.id);
  res.redirect('/farms');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
