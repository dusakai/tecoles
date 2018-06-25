var mongoose = require("mongoose");
var path = require('path');
conn1 = mongoose.createConnection('mongodb://localhost:27017/db_tecoles');
// img path
var imgPath = (path.join(__dirname, 'public/images'));
var Schema = mongoose.Schema;
var questaoSchema = new Schema({
    "codigo": String,
    "resposta": String,
    "filename": String,
});
module.exports = conn1.model('questoes', questaoSchema);
