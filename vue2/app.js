// express에서 권장하는 메인 어플리케이션의 이름 => app.js
// 이 app.js 파일은 webserver2.js를 간편하게 추상화시킨 파일이다. (By. Express)
const express = require('express');
var app = express();

app.locals.pretty = true;

// 정적인 파일을 서비스 하기.
app.use(express.static('vuejs2')); // public은 정적인 파일이 위치하는 디렉토리를 의미함.

// '/'는 home을 말한다.
app.get('/', function(req, res) {
  res.send('Hello I\'m Vue.js!');
});


app.listen(3001, function() {
  console.log('Connected 3001 port!');
});
