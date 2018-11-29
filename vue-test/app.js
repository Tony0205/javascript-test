var express = require('express');
var app = express();

app.set('view engine', 'vue')
app.set('views', './views')

app.get('/', function (req, res) {
  res.render('Helloworld');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});