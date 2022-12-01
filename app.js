const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const { connectDB } = require('./config/db.js');
const morgan = require('morgan');
const methodOverride = require('method-override')

//Load config
dotenv.config({ path: "./config/config.env" });


//Passport config
require('./config/passport')(passport);

connectDB()
const app = express();

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Method override

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))


//Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

// Handlebars helper
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// Handlebars template engine
app.engine('.hbs', exphbs.engine({ helpers: { formatDate, truncate, stripTags, editIcon, select }, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;

//Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`);
})