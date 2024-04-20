const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const con = require('./config/db');

const app = express();

// Check database connection
con.connect(function(err) {
    if (err) {
        console.error('Error connecting to database.');
        return;
    }
    console.log('Connected to database');
});

// set the public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// for session
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //1 day in millisec
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
    // config MemoryStore here
    store: new MemoryStore({
        checkPeriod: 24 * 60 * 60 * 1000 // prune expired entries every 24h
    })
}));

// ------------- get all products for user --------------
app.get('/user/room', function (req, res) {
    const sql = "SELECT * FROM rooms WHERE status='Free'";
    con.query(sql, function (err, results) {
        if (err) {
            // console.log(sql);
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});

// Route to get a single room by id
app.get('/user/room/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const sql = `SELECT * FROM rooms WHERE id = ?`;
    con.query(sql, roomId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (result.length === 0) {
            return res.status(404).send("Room not found");
        }
        res.json(result[0]);
    });
});

// ------------ root service ----------
app.get('/', function (_req, res) {
    res.sendFile(path.join(__dirname, 'views/bookingroom.html'));
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log('Server is runnint at port ' + PORT);
});