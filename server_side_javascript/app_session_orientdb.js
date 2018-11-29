const express = require('express');
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended : false }));

// orient DB setting
const config = {
  session : {
    server: "host=localhost&port=2424&username=root&password=5120&db=o2"
  }
};

app.use(session({
  secret: '2123123jaklsdjflksdajlk@!#aksdjflksaa',
  resave: false, // session ID를 접속할 때 마다 새롭게 발급하지 않는다 라는 뜻. 권장값.
  saveUninitialized: true, // session ID를 세션을 실제로 사용하기 전까지는 발급하지 말라는 얘기다.
  store:  new OrientoStore(config.session)
}));

// app.get('/count', function(req, res) {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//
//   res.send('count : '+req.session.count);
// });

app.get('/auth/login', function(req, res) {
  let output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});

app.post('/auth/login', function(req, res) {

  const user = {
    username : "shlee", // ID
    password : "1111",
    displayName : "이성한" // 닉네임
  };

  let uname = req.body.username;
  let password = req.body.password;

  if (uname === user.username && password === user.password) {
    req.session.displayName = user.displayName;
    req.session.username = uname;
    req.session.pwd = password;

    req.session.save(function() { // session 이 스토어에 저장된 후에 실행.
      res.redirect('/welcome');
    });

  } else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }

});



app.get('/welcome', function(req, res) {
  if (req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);

  } else {
    res.send(`
      <h1>welcome</h1>
      <a href="/auth/login">Login</a>
    `);

  }
});


app.get('/auth/logout', function(req, res) {
  delete req.session.displayName; // delete : 자바스크립트 삭제 명령.
  delete req.session.pwd;
  delete req.session.username;
  
  req.session.save(function() {
    res.redirect('/welcome');
  });

});


app.listen(3003, function() {
  console.log('Connected 3003 port!!!');
});
