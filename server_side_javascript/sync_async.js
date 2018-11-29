const fs = require('fs');

// Sync
console.log(1);
var data = fs.readFileSync('data.txt', {encoding:'utf8'});
console.log(data);

// Async
console.log(2);
fs.readFile('data.txt', {encoding:'utf8'}, function(err, data) {
  console.log(3);
  console.log(data); // readFile 함수가 파일을 읽는 작업이 끝났을 때, 뒤의 익명함수를 내부적으로 호출한다.
  // 성공을 하였으면 data 매개변수로 내용(값)을 전달.
});
console.log(4);
