const express = require('express');
const mongoose = require('mongoose');
// const config = require('./config/database');
const morgan = require('morgan');
// const session = require('express-session');
const path = require('path');

// Routes
const momoRoute = require('./routes/momo');
// const userRoutes = require('./api/routes/user.route');

// Connection to mongodb
// mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex : true, useFindAndModify: false});
// mongoose.Promise = global.Promise
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', function() {
//     console.log('Connected to mongodb');
// });


// App initialization
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json())

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true
// }))

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
// app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Type, Accept, Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

/* App Routes */
app.get('/refresh', (req, res) => {
    res.status(204).json({"msg": "refresh server"});
});

// app.use('/api/v1/user', userRoutes);
app.use('/momo', momoRoute);



app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


// Start the app
app.listen(process.env.PORT || 5000, function() {
    console.log("Server started: ", 5000)
})