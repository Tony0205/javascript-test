const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var app = express();

app.locals.pretty = true;

app.use(bodyParser.urlencoded({ extended:false }));

app.set('views', './views_file');
app.set('view engine', 'jade');

// app.get('/topic/new', function(req, res) {
//   res.render("new");
// });

// 코드의 개선 : 중복제거...
app.get(['/topic', '/topic/:id'], function(req, res) {
  fs.readdir('data', function(err, files){
    if (err) {
      console.log(err);
      res.status(500).send('Internal readdir Server Error');
    }

    var id = req.params.id;

    if (id == "new") {
      res.render('new', {topics:files});
    }

    // id 값이 있을 때
    if (id) {
      fs.readFile('data/'+id, 'utf8', function(err, data){
        if (err) {
          console.log(err);
          res.status(500).send('Internal readFile Server Error');
        }

        res.render('view', {title:id, topics:files, description : data});

      });

    } else {
      // id 값이 없을 때
      res.render("view", {topics : files, title:'Welcome', description:'Hello, JavaScript for server.'});
    }

  });

});


// app.get('/topic/:id', function(req, res) {
//  var id = req.params.id; // 위 :id에 접근하여 var id 라는 변수에 담는다.
//
//  fs.readdir('data', function(err, files){
//    if (err) {
//      console.log(err);
//      res.status(500).send('Internal Server Error');
//    }
//
//    fs.readFile('data/'+id, 'utf8', function(err, data){
//      if (err) {
//        console.log(err);
//        res.status(500).send('Internal Server Error');
//      }
//      res.render('view', {title:id, topics:files, description : data});
//    });
//
//  });
//
// });

app.post('/topic', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err) {
      if (err) {
        res.status(500).send('Internal Server Error');
      }
      res.redirect('/topic/'+title);
  });

})

app.listen(3000, function() {
  console.log("Connected 3000 Port!");
})
