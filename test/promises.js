'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var when = require('when');

var funcDone = require('../');

function success() {
  return when.resolve(2);
}

function failure() {
  return when.reject(new Error('Promise Error'));
}

describe('promises', function() {

  it('should handle a resolved promise', function(done) {
    funcDone(success, function(err, result) {
      expect(result).to.equal(2);
      done(err);
    });
  });

  it('should handle a rejected promise', function(done) {
    funcDone(failure, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});
