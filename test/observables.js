'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var funcDone = require('../');

var Observable = require('rx').Observable;

function success() {
  return Observable.empty();
}

function successValue() {
  return Observable.return(42);
}

function failure() {
  return Observable.throw(new Error('Observable error'));
}

describe('observables', function() {

  it('should handle a finished observable', function(done) {
    funcDone(success, function(err, result) {
      expect(result).to.equal(undefined);
      done(err);
    });
  });

  it('should handle a finished observable with value', function(done) {
    funcDone(successValue, function(err, result) {
      expect(result).to.equal(42);
      done(err);
    });
  });

  it('should handle an errored observable', function(done) {
    funcDone(failure, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});
