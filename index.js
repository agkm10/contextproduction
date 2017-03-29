const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const massive = require('massive');
const config = require('./config.json');
const passport = require('./passport');
const wellRouter = require('./routes/wellRouter.js')

const app = express();
const port = 3000;
app.use(express.static( 'public'));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/wells', wellRouter);
app.listen(port, () => {
    console.log(`Listening on port ${config.port}`)
})
