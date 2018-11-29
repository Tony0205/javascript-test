// node.js로 웹서버 구현하기
const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});
server.listen(port, hostname, function() {
  // server가 listenning에 성공했을 때, callback
  console.log(`Server running at http://${hostname}:${port}/`);
});
