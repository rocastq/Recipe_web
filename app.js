const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/recipe-app');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.use(session({
  secret: 'secret', resave: false, saveUninitialized: true
}));

app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/recipes', require('./routes/recipes'));

app.get('/', (req, res) => res.redirect('/recipes'));

app.listen(3000, () => console.log('Server on 3000'));
