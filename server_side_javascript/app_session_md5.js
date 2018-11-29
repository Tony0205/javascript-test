const express = require('express');
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const bodyParser = require('body-parser');
const md5 = require('md5');

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
  // 사용자의 pwd가 저장되어 있는 객체
  // 사용자의 원래 비밀번호에다가 어떠한 부가적인 정보를 추가하여
  // 원래의 비밀번호가 무엇인지 알기 힘들게 만드는 것을, 보안쪽에서는 salt 라고 한다.
  const users = [
    {
      username : "shlee", // ID
      password : "c5dbc13caab681d8b1fc2a93c6b8ce70",
      salt:'!@##%ASDFSD',
      displayName : "이성한" // 닉네임
    },
    {
      username : "dingo", // ID
      password : "96d62c3e212d594ae39d827895fc0c6e",
      salt:'asnlkfnksl!@$%#%@sdfa',
      displayName : "아이유" // 닉네임
    }
  ];

  let uname = req.body.username;
  let password = req.body.password;

  for (var i = 0; i < users.length; i++) {
    let user = users[i];

    if (uname === user.username && md5(password+user.salt) === user.password) {
      req.session.displayName = user.displayName;
      req.session.username = uname;
      req.session.pwd = password;

      return req.session.save(function() { // session 이 스토어에 저장된 후에 실행.
        res.redirect('/welcome');
      });
    }
  }

  res.send('Who are you? <a href="/auth/login">login</a>');

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
