'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var funcDone = require('../');

function* success () {
    yield Promise.resolve(10);
    return 2;
}

function* failure() {
    throw new Error('error');
    return 10;
}

describe('generators', function() {

    it('should handle a success generator', function(done) {
        funcDone(success, function(err, result) {
            expect(result).to.equal(2);
            done();
        });
    });

    it('should handle a error generator', function(done) {
        funcDone(failure, function(err) {
            expect(err).to.be.instanceof(Error);
            expect(err.message).to.equal('error');
            done();
        });
    });
});
