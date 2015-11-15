'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var asyncDone = require('../');

function success() {
  return 2;
}

function failure() {
  throw new Error('Sync Error');
}

describe('sync', function() {
  it('should handle simple return', function(done) {
    asyncDone(success, function(err, result) {
      expect(result).to.equal(2);
      done(err);
    });
  });
  it('should handle a thrown error', function(done) {
    asyncDone(failure, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});
