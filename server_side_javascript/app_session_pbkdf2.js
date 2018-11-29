const express = require('express');
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const bodyParser = require('body-parser');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();

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


// 회원가입 페이지
app.get('/auth/register', function(req, res) {
  let registerOutput = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit" value="회원가입">
    </p>
  </form>`;

  res.send(registerOutput);
});


// 회원가입 execute
app.post('/auth/register', function(req, res) {
  let userName = req.body.username;
  let userPwd = req.body.password;
  let displayName = req.body.displayName;
  let userObj = {};

  hasher({password:userPwd}, function(err, pass, salt, hash) {
    userObj = {
      username : userName, // ID
      password : hash,
      salt:salt,
      displayName : displayName // 닉네임
    }
    console.log("유저객체는?", userObj);
    users.push(userObj);

    req.session.username = userName;
    req.session.pwd = userPwd;
    req.session.displayName = displayName;

    req.session.save(function() {
      res.redirect('/welcome');
    });

  });

});



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
      <input type="submit" value="로그인">
    </p>
    <p>
      <a href="/auth/register">Register</a>
    </p>
  </form>
  `;
  res.send(output);
});



/* ============ User Info =============*/
// 사용자의 pwd가 저장되어 있는 객체
// 사용자의 원래 비밀번호에다가 어떠한 부가적인 정보를 추가하여
// 원래의 비밀번호가 무엇인지 알기 힘들게 만드는 것을, 보안쪽에서는 salt 라고 한다.
// 아래의 user 객체는, pbkdf2 암호화 함수를 통해 만든 salt 값이다. (비밀번호는 쓰던 그것.)
const users = [
  {
    username : "shlee", // ID
    password : "EbQhqF45FrrLPfhvDiqX3efyP5IMkHZgNGVRaicDgFvQfa3qcDRiSGINAXq1K7WN5QcsZHZAYYfsekxr9/HjPlt+N81uYCSotj+0VW6/Uwu/DgftE4FOynQ+Fgr0ALvbRv/WaPEHHUpxvW1gj8AP1liJ9cOER0y3TeJK88fUROE=",
    salt:'Nz1WTHkCK8jSp/7jLusnqwyy7KbAXK4EhuxK7JFSQqevd9ZWSflsA/5h3z7qqKX5xifV6QtmsmCAL4ZPgtbMCQ==',
    displayName : "이성한" // 닉네임
  }
];


app.post('/auth/login', function(req, res) {

  let uname = req.body.username;
  let userPwd = req.body.password;

  for (var i = 0; i < users.length; i++) {
    console.log("로그인 루프는?", users[i]);
    let user = users[i];

    if (uname === user.username) {
      // password : 해쉬값으로 바꿀 대상 패스워드.
      // salt : 사용할 salt 값.
      return hasher({password:userPwd, salt:user.salt}, function(err, pass, salt, hash) {
        if (hash === user.password) {
          req.session.displayName = user.displayName;
          req.session.username = uname;
          req.session.pwd = userPwd;
          req.session.save(function() {
            res.redirect('/welcome');
          });

        } else {
          res.send('Who are you? <a href="/auth/login">login</a>');
        }
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
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
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
