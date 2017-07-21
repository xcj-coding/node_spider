const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongoDB 链接错误:'));

db.once('open', function(callback){
    console.log('MongoDB 打开!');
});

module.exports = mongoose;
