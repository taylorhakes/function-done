'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var fs = require('fs');
var cp = require('child_process');
var path = require('path');
var through = require('through2');

var funcDone = require('../');

var exists = path.join(__dirname, '../.gitignore');
var notExists = path.join(__dirname, '../not_exists');

var EndStream = through.ctor(function(chunk, enc, cb) {
  this.push(chunk);
  cb();
}, function(cb) {
  this.emit('end', 2);
  cb();
});

function success() {
  var read = fs.createReadStream(exists);
  return read.pipe(new EndStream());
}

function failure() {
  var read = fs.createReadStream(notExists);
  return read.pipe(new EndStream());
}

function unpiped() {
  return fs.createReadStream(exists);
}

describe('streams', function() {
  it('should handle a successful stream', function(done) {
    funcDone(success, function(err) {
      expect(err).to.not.be.instanceof(Error);
      done();
    });
  });

  it('should handle an errored stream', function(done) {
    funcDone(failure, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('handle a returned stream and cb by only calling callback once', function(done) {
    funcDone(function(cb) {
      return success().on('end', function() {
        cb(null, 3);
      });
    }, function(err, result) {
      expect(err).to.not.be.instanceof(Error);
      expect(result).to.equal(3); // To know we called the callback
      done();
    });
  });

  it('consumes an unpiped readable stream', function(done) {
    funcDone(unpiped, function(err) {
      expect(err).to.not.be.instanceof(Error);
      done();
    });
  });
});
