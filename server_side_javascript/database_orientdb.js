const OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '5120'
});

var db = server.use('o2'); //o2 데이터 베이스를 사용하겠다.

/*
var rec = db.record.get('#27:0').then(function(record){
  console.log('Loaded Record:', record);
});
*/

/*
 * CREATE
 * READ
 * UPDATE
 * DELETE
 *
 * CRUD
 */

// 1. CREATE Query
// var sql = "INSERT into topic (title, description) VALUES(:title, :desc)";
// var param = {
//     params : {
//       title : 'Express',
//       desc : 'Express is framework for Web'
//     }
// }
// // 위의 param은 변수에 담지 않고 그대로 붙여넣기 하여도 된다.
// db.query(sql, {
//     params : {
//       title : 'Express',
//       desc : 'Express is framework for Web'
//     }
// }).then(function(results) {
//   console.log(results);
// });




// 2. READ Query
/*
var sql = 'SELECT * FROM topic';
db.query(sql).then(function(results) {
  console.log(results);
});
*/

// var sql = 'SELECT * FROM topic where @rid=:rid';
// var param = {
//   params:{
//     rid:'#27:0'
//   }
// };
//
// db.query(sql, param).then(function(results) {
//   console.log(results);
// });





// 3. UPDATE Query
// var sql = "UPDATE topic SET title = :title WHERE @rid = :rid";
//
// db.query(sql, {params:{title:'Expressjs', rid:'#26:1'}}).then(function(results) {
//   console.log(results); // 수정을 하게 되면 오리엔트js는 성공한 결과값으로 '몇개의 행'이 수정이 되었는지를 보여준다.
// });


// 4. DELETE Query
// var sql = "DELETE FROM topic WHERE @rid=:rid";
// db.query(sql, {params:{rid:'#26:1'}}).then(function(results) {
//  console.log(results); // DELETE 도 똑같이, 삭제 된 행(Row)의 숫자가 출력된다.
// });
