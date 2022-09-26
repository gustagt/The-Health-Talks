const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

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
            path: require('path').join(require('os').tmpdir(),'sessions'),
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

//Routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

const ToughtController = require('./controllers/ToughtController')
app.get('/', ToughtController.showToughts);


//Set Session to response
app.use((req, res, next) => {
    
    if(req.session.userid){
        res.locals.session = req.session
    }

    next();
})

//Models
const Tought = require('./models/Tought');
const User = require('./models/User');


const conn = require('./db/Conn');

conn.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => {
        console.log(err)
    })