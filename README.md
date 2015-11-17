function-done
==========

[![build status](https://secure.travis-ci.org/taylorhakes/function-done.png)](http://travis-ci.org/taylorhakes/function-done)

Handles completion and errors for standard functions, generators, async functions, callbacks, promises, observables, child processes and streams.

Will run call the function on `nextTick`. This will cause all functions to be async.

## Why?
You are given a callback and want to know when it's finished. I found it useful for a testing framework. Specifically, I needed to know when the test had finished.

## asyncDone Fork
This is a fork of asyncDone with sync and generator functionality added. Thanks for the hard work at [gulpjs/async-done](https://github.com/gulpjs/async-done)

## API

### `funcDone(fn, callback)`

Takes a function to execute (`fn`) and a function to call on completion (`callback`).

#### `fn([done])`

Optionally takes a callback to call when async tasks are complete. If done parameter is not defined and function
doesn't return Stream, Child Process, Promise, Observable, and is not a generator function, the function is assumed to be synchronous

## Usage

### Successful completion

#### Callback
```js

// Async example
funcDone(function(done){

  // do async things
  setTimeout(function() {

    // Call done function on finish
    done(null, 2);
  }, 10);
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

#### Stream
```js
funcDone(function(){

 // return Stream. emit end of finish
 var read = fs.createReadStream(exists);
 return read.pipe(new EndStream());
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Generator
```js
funcDone(function* (){
  function delay(time) {
    return new Promise(function (resolve) {
       setTimeout(resolve, time);
    });
  }

  // yield as many times as necessary
  yield delay(10);
  yield delay(100);
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Promise
```js
funcDone(function (){
  function delay(time) {
    return new Promise(function (resolve) {
       setTimeout(resolve, time);
    });
  }

  // return a Promise from the function
  return delay(10).then(function() {
    return delay(100);
  });
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

#### Async Function
```js
funcDone(async function (){
  function delay(time) {
    return new Promise(function (resolve) {
       setTimeout(resolve, time);
    });
  }

  // return a Promise from the function
  await delay(10);
  await delay(100);
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Child Process
```js
funcDone(function(){

  // return child process from the function
  return cp.exec('echo hello world');
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Sync
```js
funcDone(function(){
  return 2
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

### Failed completion

#### Callback
```js

// Async example
funcDone(function(done){

  // do async things
  setTimeout(function() {

    // Call done function on finish
    done(new Error('An Error Occurred'));
  }, 10);
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

#### Stream
```js
funcDone(function(){

 // return Stream. emit end of finish
 var read = fs.createReadStream(notExists);
 return read.pipe(new EndStream());
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Generator
```js
funcDone(function* (){
  throw new Error('Generator error');
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Promise
```js
funcDone(function (){
  return Promise.reject(new Error('Rejected Promise'));
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

#### Async Function
```js
funcDone(async function (){
  throw new Error('Async Error');
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Child Process
```js
funcDone(function(){

  // return child process error from the function
  return cp.exec('not-an-executable hello world');
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```
#### Sync
```js
funcDone(function(){
  throw new Error('function error');
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

#### Completion and Error Resolution
* `Sync` function (function takes 0 params and doesn't return any of the below types)
  - Completion: function completes
  - Error: Error thrown
* `Callback` called
  - Completion: called with null error
  - Error: called with non-null error
* `Stream` or `EventEmitter` returned
  - Completion: [end-of-stream](https://www.npmjs.org/package/end-of-stream) module
  - Error: [domains](http://nodejs.org/api/domain.html)
* `Generator` returned
  - Completion: function completes
  - Error: Error thrown
* `Child Process` returned
  - Completion [end-of-stream](https://www.npmjs.org/package/end-of-stream) module
  - Error: [domains](http://nodejs.org/api/domain.html)
* `Promise` returned (Async Function)
  - Completion: [onFulfilled](http://promisesaplus.com/#point-26) method called
  - Error: [onRejected](http://promisesaplus.com/#point-30) method called
* `Observable` returned
  - Completion: [onCompleted](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted) method called
  - Error: [onError](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted) method called


#### `callback(error, result)`

If an error doesn't occur in the execution of the `fn` function, the `callback` method will receive the results as its second argument. Note: Observable and some streams don't received any results.

If an error occurred in the execution of the `fn` function, The `callback` method will receive an error as its first argument.

Errors can be caused by:

* A thrown error
* An error passed to a `done` callback
* An `error` event emitted on a returned `Stream`, `EventEmitter` or `Child Process`
* A rejection of a returned `Promise`
* The `onError` handler being called on an `Observable`

## License

MIT
