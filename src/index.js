const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

// Intializations
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Global variables
app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});

// Routes
app.use('/users', require('./routes/users'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});
