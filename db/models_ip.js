let mongoose = require('./db.js');

let ipSchema = mongoose.Schema({
    country: {type: String},
    ip: {type: String},
    port: {type: String},
    area: {type: String},
    types: {type: String},
    protocol: {type: String},
    speed: {type: String},
    time: {type: String},
});

let ipModel = mongoose.model('ipSchema',ipSchema);

module.exports = ipModel;


// let ipOne = new ipModel({name: 'fff'});

// ipOne.save(function(err){
//     if(err) return console.error(err);
//     console.log('写入成功！');

//     ipModel.find(function(err, docs){
//     if(err) return console.error(err);
//     console.log(docs);
//     });
// });

