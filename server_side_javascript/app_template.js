const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended : false }));


app.listen(3003, function() {
  console.log('Connected 3003 port!!!');
});
