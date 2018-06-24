var mongoose = require("mongoose");
var path = require('path');
conn1 = mongoose.createConnection('mongodb://localhost:27017/db_tecoles');
// img path
var imgPath = (path.join(__dirname, 'public/images'));
var Schema = mongoose.Schema;
var questao = new Schema({
    "_id": {type: String, required: true},
    "img": { data: Buffer, contentType: String },
    "name": String
});
module.exports = conn1.model('questoes', questaoSchema);
