// Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoAlunoOp = require('./models/alunos');
var mongoProfessorOp = require('./models/professores');
var mongoQuestaoOp = require('./models/questoes');

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
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
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
     mongoAlunoOp.find({}, function(erro, data) {
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
     mongoAlunoOp.findOne(query, function(erro, data) {
        if (data == null) {
           var db = new mongoAlunoOp();
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
      mongoAlunoOp.findOne(query, function(erro, data) {
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
      mongoAlunoOp.findOneAndUpdate(query, data, function(erro, data) {
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
      mongoAlunoOp.findOneAndRemove(query, function(erro, data) {
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

  router.route('/professores')   // operacoes sobre todos os alunos
   .get(function(req, res) {  // GET
       var response = {};
       mongoProfessorOp.find({}, function(erro, data) {
         if(erro)
            response = {"resultado": "falha de acesso ao BD"};
          else
            response = {"professores": data};
            res.json(response);
          }
        )
      }
    )
    .post(function(req, res) {   // POST (cria)
       console.log(JSON.stringify(req.body));
       var query = {"matricula": req.body.matricula};
       var response = {};
       mongoProfessorOp.findOne(query, function(erro, data) {
          if (data == null) {
             var db = new mongoProfessorOp();
             db.matricula = req.body.matricula;
             db.nome = req.body.nome;
             db.curso = req.body.curso;
             db.save(function(erro) {
               if(erro) {
                   response = {"resultado": "falha de insercao no BD"};
                   res.json(response);
               } else {
                   response = {"resultado": "professor inserido no BD"};
                   res.json(response);
                }
              }
            )
          } else {
  	    response = {"resultado": "professor ja existente"};
              res.json(response);
            }
          }
        )
      }
    );


  router.route('/professores/:matricula')   // operacoes sobre um aluno (RA)
    .get(function(req, res) {   // GET
        var response = {};
        var query = {"matricula": req.params.matricula};
        mongoProfessorOp.findOne(query, function(erro, data) {
           if(erro) {
              response = {"resultado": "falha de acesso ao BD"};
              res.json(response);
           } else if (data == null) {
               response = {"resultado": "professor inexistente"};
               res.json(response);
  	 } else {
  	    response = {"professores": [data]};
              res.json(response);
             }
          }
        )
      }
    )
    .put(function(req, res) {   // PUT (altera)
        var response = {};
        var query = {"matricula": req.params.matricula};
        var data = {"nome": req.body.nome, "curso": req.body.curso};
        mongoProfessorOp.findOneAndUpdate(query, data, function(erro, data) {
            if(erro) {
              response = {"resultado": "falha de acesso ao DB"};
              res.json(response);
  	  } else if (data == null) {
               response = {"resultado": "professor inexistente"};
               res.json(response);
            } else {
               response = {"resultado": "professor atualizado no BD"};
               res.json(response);
  	  }
          }
        )
      }
    )
    .delete(function(req, res) {   // DELETE (remove)
       var response = {};
       var query = {"matricula": req.params.matricula};
        mongoProfessorOp.findOneAndRemove(query, function(erro, data) {
           if(erro) {
              response = {"resultado": "falha de acesso ao DB"};
              res.json(response);
  	 } else if (data == null) {
               response = {"resultado": "matricula inexistente"};
               res.json(response);
              } else {
                response = {"resultado": "matricula removido do BD"};
                res.json(response);
  	   }
           }
         )
       }
    );

    // questoes
    router.route('/questoes')   // operacoes sobre todos os questoes
     .get(function(req, res) {  // GET
         var response = {};
         mongoQuestaoOp.find({}, function(erro, data) {
           if(erro)
              response = {"resultado": "Falha de acesso ao BD"};
            else
              response = {"questoes": data};
              res.json(response);
            }
          )
        }
      )
      .post(function(req, res) {   // POST (cria)
         console.log(JSON.stringify(req.body));
         var query = {"codigo": req.body.codigo};
         var response = {};
         mongoQuestaoOp.findOne(query, function(erro, data) {
            if (data == null) {
               var db = new mongoQuestaoOp();
               db.codigo = req.body.codigo;
               db.resposta = req.body.resposta;
               db.filename = req.body.filename;
               db.save(function(erro) {
                 if(erro) {
                     response = {"resultado": "Falha de insercao no BD"};
                     res.json(response);
                 } else {
                     response = {"resultado": "Questao inserida no BD"};
                     res.json(response);
                  }
                }
              )
            } else {
         response = {"resultado": "Questao ja existente"};
                res.json(response);
              }
            }
          )
        }
      );


    router.route('/questoes/:codigo')   // operacoes sobre um aluno (RA)
      .get(function(req, res) {   // GET
          var response = {};
          var query = {"codigo": req.params.codigo};
          mongoQuestaoOp.findOne(query, function(erro, data) {
             if(erro) {
                response = {"resultado": "falha de acesso ao BD"};
                res.json(response);
             } else if (data == null) {
                 response = {"resultado": "questao inexistente"};
                 res.json(response);
      } else {
         response = {"questoes": [data]};
                res.json(response);
               }
            }
          )
        }
      )
      .put(function(req, res) {   // PUT (altera)
          var response = {};
          var query = {"codigo": req.params.codigo};
          var data = {"resposta": req.body.resposta, "filename": req.body.curso};
          mongoQuestaoOp.findOneAndUpdate(query, data, function(erro, data) {
              if(erro) {
                response = {"resultado": "falha de acesso ao DB"};
                res.json(response);
       } else if (data == null) {
                 response = {"resultado": "questao inexistente"};
                 res.json(response);
              } else {
                 response = {"resultado": "questao atualizado no BD"};
                 res.json(response);
       }
            }
          )
        }
      )
      .delete(function(req, res) {   // DELETE (remove)
         var response = {};
         var query = {"codigo": req.params.codigo};
          mongoQuestaoOp.findOneAndRemove(query, function(erro, data) {
             if(erro) {
                response = {"resultado": "falha de acesso ao DB"};
                res.json(response);
      } else if (data == null) {
                 response = {"resultado": "questao inexistente"};
                 res.json(response);
                } else {
                  response = {"resultado": "questao removido do BD"};
                  res.json(response);
        }
             }
           )
         }
      );
