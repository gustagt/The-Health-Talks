const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

//Express Setup
const app = express();
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(express.static('public'));

//Session Middleware Setup
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tempdir(),'sessions'),
        }),
        cookie: {
            secure:false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

//Flash Messages Setup
app.use(flash());

//Set Session to response
app.use((req, res, next) => {
    
    if(req.session.userid){
        res.locals.session = req.session
    }

    next();
})


const conn = require('./db/Conn');