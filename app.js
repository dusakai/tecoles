// Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoOp = require('./models/mongo');

// comente as duas linhas abaixo
// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
app.use('/', express.static(__dirname + '/'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adicione as duas linhas abaixo
var router = express.Router();
app.use('/', router);   // deve vir depois de app.use(bodyParser...

// comente as duas linhas abaixo
// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// codigo abaixo adicionado para o processamento das requisições
// HTTP GET, POST, PUT, DELETE

// index.html
router.route('/')
 .get(function(req, res) {  // GET
   var path = 'index.hatml';
   res.header('Cache-Control', 'no-cache');
   res.sendfile(path, {"root": "./"});
   }
 );

router.route('/alunos')   // operacoes sobre todos os alunos
 .get(function(req, res) {  // GET
     var response = {};
     mongoOp.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao BD"};
        else
          response = {"alunos": data};
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
     console.log(JSON.stringify(req.body));
     var query = {"ra": req.body.ra};
     var response = {};
     mongoOp.findOne(query, function(erro, data) {
        if (data == null) {
           var db = new mongoOp();
           db.ra = req.body.ra;
           db.nome = req.body.nome;
           db.curso = req.body.curso;
           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de insercao no BD"};
                 res.json(response);
             } else {
                 response = {"resultado": "Aluno inserido no BD"};
                 res.json(response);
              }
            }
          )
        } else {
	    response = {"resultado": "Aluno ja existente"};
            res.json(response);
          }
        }
      )
    }
  );


router.route('/alunos/:ra')   // operacoes sobre um aluno (RA)
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"ra": req.params.ra};
      mongoOp.findOne(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "falha de acesso ao BD"};
            res.json(response);
         } else if (data == null) {
             response = {"resultado": "aluno inexistente"};
             res.json(response);
	 } else {
	    response = {"alunos": [data]};
            res.json(response);
           }
        }
      )
    }
  )
  .put(function(req, res) {   // PUT (altera)
      var response = {};
      var query = {"ra": req.params.ra};
      var data = {"nome": req.body.nome, "curso": req.body.curso};
      mongoOp.findOneAndUpdate(query, data, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
	  } else if (data == null) {
             response = {"resultado": "aluno inexistente"};
             res.json(response);
          } else {
             response = {"resultado": "aluno atualizado no BD"};
             res.json(response);
	  }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
     var response = {};
     var query = {"ra": req.params.ra};
      mongoOp.findOneAndRemove(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
	 } else if (data == null) {
             response = {"resultado": "aluno inexistente"};
             res.json(response);
            } else {
              response = {"resultado": "aluno removido do BD"};
              res.json(response);
	   }
         }
       )
     }
  );

  // Professores
  // codigo abaixo adicionado para o processamento das requisições
  // HTTP GET, POST, PUT, DELETE

  var professores = [];

  router.route('/professores')   // operacoes sobre todos os professores
    .get(function(req, res) {  // GET
        if (professores.length == 0) {
         res.json({"professores": []});
         return;
        }
        var response = '{"professores": [';
        var professor;
        for (var i = 0; i < professores.length; i++) {
           professor = JSON.stringify(professores[i]);   // JSON -> string
           if (professor != '{}')   // deletado ?
              response = response + professor + ',';
        }
        if (response[response.length-1] == ',')
           response = response.substr(0, response.length-1);  // remove ultima ,
        response = response + ']}';  // fecha array
        res.send(response);
        }
     )
    .post(function(req, res) {   // POST (cria)
        id = professores.length;
        professores[id] = req.body;    // armazena em JSON
        response = {"id": id};
        res.json(response);
      }
   );

  router.route('/professores/:id')   // operacoes sobre um professor (ID)
    .get(function(req, res) {   // GET
        response = '{}';
        id = parseInt(req.params.id);
        if(professores.length > id)
          response = JSON.stringify(professores[id]);
        res.send(response);
        }
    )
    .put(function(req, res) {   // PUT (altera)
        response = {"updated": "false"};
        id = parseInt(req.params.id);
        if(professores.length > id) {
           professores[id] = req.body;
           response = {"updated": "true"};
        }
        res.json(response);
      }
    )
    .delete(function(req, res) {   // DELETE (remove)
        response = {"deleted": "false"};
        id = parseInt(req.params.id);
        if(professores.length > id && JSON.stringify(professores[id]) != '{}') {
           professores[id] = {};
           response = {"deleted": "true"};
        }
        res.json(response);
      }
    );
