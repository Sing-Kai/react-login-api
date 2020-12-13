const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLstore = require('express-mysql-session');
const Router = require('./Router');


app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp'
});

db.connect(function(err){
    if(err){
        console.log('db errror')
        throw err;
        return false;
    }else{
        console.log('db connected')     
    }
});

const sessionStore = new MySQLstore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({

    key: '23423423adadf',
    secret: 'asdlfkj3223423234',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, db);

app.get('/', function(req, res){
    res.sendFile(path.join(__direname, 'build', 'index.html'));
});

app.listen(3000);

