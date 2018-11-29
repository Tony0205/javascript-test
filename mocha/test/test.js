var assert = require("assert"); //nodejs에서 제공하는 aseert 모듈

describe('Array 테스트', function() {
	describe('indexOf() 메서드', function () {
		it('값이 없을 때에는 -1 을 리턴함', function () {
			assert.equal(-1, [1,2,3].indexOf(7));
			assert.equal(-1, [1,2,3].indexOf(0));
		});
	});
});


describe('비동기 코드 테스트', function () {
	describe('#setTimeout', function () {
		it('2초 이내에 완료되지 않으면 실패', function (done) {
			setTimeout(function () {
				done();
			}, 1000);
		});
	});
});