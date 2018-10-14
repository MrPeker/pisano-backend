let mongoose = require('mongoose');

// Configurations for Database

let config = {
    username: 'pisano',
    pass: 'KbE8MdbLfCmr2GGJjCW7zT6njYZtmcRn',
    dbname: 'pisano',
    host: '52.28.78.239',
    port: '27017',
};

// Connect to database
mongoose.connect('mongodb://' + config.username + ':' + config.pass + '@' + config.host + ':' + config.port + '/' + config.dbname)
    .then((err) => {
        if(err) throw err;
        else console.log('Connected to database');
    })
    .catch((err) => {
        throw err;
    });

// If is connected show it.
mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});

// If it is have any error
mongoose.connection.on('error', function (err) {
    throw err;
});


module.exports =  mongoose;