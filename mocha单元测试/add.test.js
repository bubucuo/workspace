var add = require('./add');
describe('test add', function() {
	if('1+1 should be equal to 2', function(done) {
		(add(1,1) == 2).should.be.true;
	});
});