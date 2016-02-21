'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var funcDone = require('../');

function success() {
  return Promise.resolve(2);
}

function failure() {
  return Promise.reject(new Error('Promise Error'));
}

function failureAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      throw new Error('Async Error');
      resolve(10);
    }, 5);
  });
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

  it('should handle async error Promise not resolved', function(done) {
    funcDone(failureAsync, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});
