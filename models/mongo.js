var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://localhost:27017/db_tecoles');
var Schema = mongoose.Schema;
var alunoSchema = new Schema({
    "ra": String,
    "nome": String,
    "curso": String
});
var professorSchema = new Schema({
    "id": String,
    "nome": String,
    "materia": String
});
module.exports = conn1.model('alunos', alunoSchema);
