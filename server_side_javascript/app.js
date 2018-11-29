// express에서 권장하는 메인 어플리케이션의 이름 => app.js
// 이 app.js 파일은 webserver2.js를 간편하게 추상화시킨 파일이다. (By. Express)
const express = require('express');
var app = express();

app.locals.pretty = true;

// jade의 사용...
app.set('view engine', 'jade');
app.set('views', './views'); // 생략하여도 익스프레스는 이 폴더를 찾도록 기본값으로 가지고 있다.

// 정적인 파일을 서비스 하기.
app.use(express.static('public')); // public은 정적인 파일이 위치하는 디렉토리를 의미함.

// bodyParser API를 require...
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));

// Post 방식에 대해서... (29강)
app.get('/form', function(req, res) {
  res.render('form');
});

// 쿼리스트링 방식 (get 방식...)
app.get('/form_receiver', function(req, res) {
  var title = req.query.title;
  var description = req.query.description;
  res.send(title+','+description);
});

// post 방식
app.post('/form_receiver', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  res.send(title+','+description+'abcde');
});

// 쿼리스트링에 대해서... (강의)
app.get('/topic', function(req, res) {
  var topics = [
    'Javascript is....',
    'Nodejs is...',
    'Express is...'
  ];

  var output = `
    <a href="/topic?id=0">JavaScript</a><br>
    <a href="/topic?id=1">Nodejs</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    ${topics[req.query.id]}
  `;

  res.send(output);
});

// 시맨틱 URL 방식...
app.get('/topic/:id/:mode', function(req, res) {
  res.send(req.params.id+', '+req.params.mode);
});



app.get('/template', function(req, res) {
  res.render('temp', {time:Date(), hoho:'hohoho', _title:'Jade'}); // ./views폴더의 temp 파일을 랜더링 해서 전송(응답)한다.
});

// '/'는 home을 말한다.
app.get('/', function(req, res) {
  res.send('Hello home page');
});

app.get('/route', function(req, res) {
  res.send('Hello Router, <img src="/kimlove.jpg">');
});

// login 경로를 뜻함.
// get()함수는 라우터라고 한다. 아래의 기능을 라우팅이라고 한다.
// 라우터의 역할은 사용자의 요청과 그 요청에 대한 처리를 하는 컨트롤러 사이에서 그들을 중개하는 중개자의 역할.
app.get('/login', function(req, res) {
  res.send('Login please');
});

app.get('/dynamic', function(req, res) {
  var lis = '';
  for (var i = 0; i < 5; i++) {
    lis = lis + '<li>conding</li>';
  }
  var time = Date();

  var output = `
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
  </head>
  <body>
    Hello, Dynamic!
    <ul>
    ${lis}
    </ul>
    ${time}
  </body>
  </html>`;
  res.send(output);
});



app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
