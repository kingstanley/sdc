 const express = require('express');
 const exphbs = require('express-handlebars');
 const session = require('express-session');
 const cookieParser = require('cookie-parser');
 const flash = require('connect-flash');
 const passport = require('passport');
 const bodyParser = require('body-parser');
 const oauth2 = require('passport-google-oauth20');
 //const Sequilize = require('sequelize');
 const path = require('path');
 const methodOverride = require('method-override');
 const fileUpload = require('express-fileupload');
 const mongoose = require('mongoose');
 const paginateHelper = require('express-handlebars-paginate');
 
 

 const app = express();

 // Load Models
 const User = require('./models/User');
 const Post = require('./models/Post');
 // Load Routes
 const index = require('./routes/index');
 const posts = require('./routes/posts');
 const account = require('./routes/account');
 const postApi = require('./routes/api');

 //Load passport
 require('./configs/passport')(passport);

 // Connect to mongoDB
 //mongoose.Promise = global.Promise;
 const key = require('./configs/keys');
mongoose.connect(key.mongoURI,{
    useNewUrlParser:true
}).then(console.log('MongoDb Connected!'))
.catch((err) => console.log(err));

 //express helpers
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select, formatTitle
} = require('./helpers/hbs');
// Register handlebars-paginate as a helper
//exphbs.registerHelper('paginate', require('handlebars-paginate'));
// set express static folder
app.use(express.static(path.join(__dirname, 'public')));

 // Express-Handlebars Middle Wares
 app.engine('handlebars', exphbs({
    helpers:{
        formatDate: formatDate,
        stripTags: stripTags,
        truncate: truncate,
        select: select,
        editIcon: editIcon,
        paginate: require('handlebars-paginate'),
        pagination: paginateHelper.createPagination,
        formatTitle:formatTitle
    },
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// CookieParser Middle Ware
app.use(cookieParser());
app.use(session({
    secret: 'Nodeblog',
    resave: false,
    saveUninitialized: false
}));
//BodyParser Middle Ware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash Middle Ware
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');
    res.locals.user = req.user || null;
    next();
})

// Method-override Middle Ware
app.use(methodOverride('_method'));

// Express-fileUpload Middleware
app.use(fileUpload());

// Core Middle ware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
  });
  
// Use Routes
app.use('/', posts);
app.use('/dashboard', index);
app.use('/account', account);
app.use('/postapi', postApi);

const port = process.env.PORT || 40000;
 app.listen(port, (req, res) => {
     console.log(`App started on port ${port}`)
 })
 