const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

const app = express();
const uri =
  'mongodb+srv://mongodb:mongo1988@cluster0.tfyy1.mongodb.net/crude?retryWrites=true&w=majority';

MongoClient.connect(uri, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db('crude');
  app.listen(3000, () => {
    console.log('Server Started!');
  });
});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

//Rotas relacionadas com os professores

app.get('/professores', (request, response) => {
  response.render('./professores/home/index.ejs');
});

app.get('/professores', (req, res) => {
  var cursor = db.collection('professores').find();
});

app.get('/professores/show', (req, res) => {
  db.collection('professores')
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err);
      res.render('./professores/show/show.ejs', { data: results });
    });
});

app.post('/professores/show', (request, response) => {
  db.collection('professores').save(request.body, (err, result) => {
    if (err) return console.log(err);

    console.log('Salvo no Banco de Dados!');
    response.redirect('/professores/show');
  });
});

app
  .route('/professores/edit/:id')
  .get((request, response) => {
    var id = request.params.id;

    db.collection('professores')
      .find(ObjectId(id))
      .toArray((err, result) => {
        if (err) return response.send(err);
        response.render('./professores/edit/edit.ejs', { data: result });
      });
  })
  .post((request, response) => {
    var id = request.params.id;
    var nome = request.body.nome;
    var email = request.body.email;
    var endereco = request.body.endereco;
    var ctps = request.body.ctps;
    var formacao = request.body.formacao;
    var titulo = request.body.titulo;
    var matricula = request.body.matricula;
    var dataNas = request.body.dataNas;

    db.collection('professores').updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          nome: nome,
          email: email,
          endereco: endereco,
          ctps: ctps,
          formacao: formacao,
          titulo: titulo,
          matricula: matricula,
          dataNas: dataNas,
        },
      },
      (err, result) => {
        if (err) return response.send(err);
        response.redirect('/professores/show');
        console.log('Atualizado no Banco de Dados');
      }
    );
  });

app.route('/professores/delete/:id').get((request, response) => {
  var id = request.params.id;

  db.collection('professores').deleteOne(
    { _id: ObjectId(id) },
    (err, result) => {
      if (err) return response.send(500, err);
      console.log('Deletando do Banco de Dados!');
      response.redirect('/professores/show');
    }
  );
});

//Fim das rotas relacionadas com os professores
