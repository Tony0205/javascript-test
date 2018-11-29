const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.locals.pretty = true;

app.use(bodyParser.urlencoded({ extended:false }));

app.set('views', './views_orientdb');
app.set('view engine', 'jade');

// app.get('/topic/new', function(req, res) {
//   res.render("new");
// });


// OrientDB 선언 --------
const OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '5120' // 보안적으로 문제... => 설정파일만 따로 뺀다.
});

var db = server.use('o2'); //o2 데이터 베이스를 사용하겠다.
// -----------------


// 아래의 라우트보다 더 먼저 실행이 된다.
// CREATE Page
app.get('/topic/add', function(req, res){
  var sql = 'SELECT FROM topic';

  db.query(sql).then(function(topics) {
    res.render('add', {topics:topics});
  });

});


// CREATE Execute
app.post('/topic/add', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  var sql = 'INSERT INTO topic (title, description, author) VALUES (:title, :description, :author)';

  db.query(sql, {
    params: {
      title : title,
      description : description,
      author : author
    }
  }).then(function(results) {
    res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
  });

})


// READ Page
app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics) {
    var id = req.params.id;

    // JavaScript 에서는 어떠한 값이 있으면 참으로 간주함.
    // id가 있을 경우...
    if (id) {
      var sql = "SELECT FROM topic WHERE @rid = :rid";
      db.query(sql, {params:{rid:id}}).then(function(topic) {
        res.render('view', {topics:topics, topic:topic[0]});
      });

    } else { // id가 없을 경우...
        res.render('view', {topics:topics});

    }

  });

});


// UPDATE Page
app.get('/topic/:id/edit', function(req, res){
  var sql = 'SELECT * FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(topics) {
    var sql = 'SELECT * FROM topic WHERE @rid = :rid';

    db.query(sql, {params:{rid:id}}).then(function(topic) {
        res.render('edit', {topics:topics, topic:topic[0]});
    });

  });

});


// UPDATE Execute
app.post('/topic/:id/edit', function(req, res){
  var sql = 'UPDATE topic SET title = :title, description = :desc, author = :author WHERE @rid=:rid';

  var id = req.params.id;
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;

  db.query(sql, {
    params:{
      title : title,
      desc : desc,
      author : author,
      rid : id

    }
  }).then(function(topics) {
    console.log(topics); // UPDATE 쿼리 실행시, 결과 값은 몇개의 행(Row)을 업데이트 했는지가 나온다.
    res.redirect('/topic/'+encodeURIComponent(id))

  });

});





// Delete Page
app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT * FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(topics) {
    var sql = 'SELECT * FROM topic WHERE @rid = :rid';

    db.query(sql, {params:{rid:id}}).then(function(topic) {
        res.render('delete', {topics:topics, topic:topic[0]});
    });

  });

});


// Delete Execute
app.post('/topic/:id/delete', function(req, res){
  var sql = 'DELETE FROM topic WHERE @rid = :rid';
  var id = req.params.id;
  db.query(sql, {
    params:{
      rid : id
    }
  }).then(function(topics) {
    console.log(topics); // UPDATE 쿼리 실행시, 결과 값은 몇개의 행(Row)을 업데이트 했는지가 나온다.
    res.redirect('/topic');

  });

});


app.listen(3000, function() {
  console.log("Connected 3000 Port!");
})
