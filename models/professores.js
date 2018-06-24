var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://localhost:27017/db_tecoles');
var Schema = mongoose.Schema;
var professorSchema = new Schema({
    "matricula": String,
    "nome": String,
    "curso": String
});
module.exports = conn1.model('professores', professorSchema);
