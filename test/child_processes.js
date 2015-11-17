'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var cp = require('child_process');
var funcDone = require('../');


function execSuccess() {
  return cp.exec('echo hello world');
}

function execFail() {
  return cp.exec('foo-bar-baz hello world');
}

function spawnSuccess() {
  return cp.spawn('echo', ['hello world']);
}

function spawnFail() {
  return cp.spawn('foo-bar-baz', ['hello world']);
}

describe('child processes', function() {
  it('should handle successful exec', function(done) {
    funcDone(execSuccess, function(err) {
      expect(err).to.not.be.instanceof(Error);
      done();
    });
  });

  it('should handle failing exec', function(done) {
    funcDone(execFail, function(err) {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });

  it('should handle successful spawn', function(done) {
    funcDone(spawnSuccess, function(err) {
      expect(err).to.not.be.instanceof(Error);
      done();
    });
  });

  it('should handle failing spawn', function(done) {
    funcDone(spawnFail, function(err) {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });
});
