# grunt-lib-phantomjs [![Build Status: Linux](https://travis-ci.org/gruntjs/grunt-lib-phantomjs.svg?branch=master)](https://travis-ci.org/gruntjs/grunt-lib-phantomjs) [![Build Status: Windows](https://ci.appveyor.com/api/projects/status/69g3o5c5m0fyih9r/branch/master?svg=true)](https://ci.appveyor.com/project/gruntjs/grunt-lib-phantomjs/branch/master)

> Grunt and PhantomJS, sitting in a tree.


## Usage

The best way to understand how this lib should be used is by looking at the [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit) plugin. Mainly, look at how [the lib is required](https://github.com/gruntjs/grunt-contrib-qunit/blob/d99291713d32f84e50303d6e51eb2dab40b1deb6/tasks/qunit.js#L17), how [event handlers are bound](https://github.com/gruntjs/grunt-contrib-qunit/blob/d99291713d32f84e50303d6e51eb2dab40b1deb6/tasks/qunit.js#L61-L144) and how [PhantomJS is actually spawned](https://github.com/gruntjs/grunt-contrib-qunit/blob/d99291713d32f84e50303d6e51eb2dab40b1deb6/tasks/qunit.js#L177-L190).

Also, in the case of the grunt-contrib-qunit plugin, it's important to know that the page being loaded into PhantomJS *doesn't* know it will be loaded into PhantomJS, and as such doesn't have any PhantomJS->Grunt code in it. That communication code, aka. the ["bridge"](https://github.com/gruntjs/grunt-contrib-qunit/blob/d99291713d32f84e50303d6e51eb2dab40b1deb6/phantomjs/bridge.js), is dynamically [injected into the html page](https://github.com/gruntjs/grunt-contrib-qunit/blob/d99291713d32f84e50303d6e51eb2dab40b1deb6/tasks/qunit.js#L152).


## An inline example

If a Grunt task looked something like this:

```js
grunt.registerTask('mytask', 'Integrate with phantomjs.', function() {
  var phantomjs = require('grunt-lib-phantomjs').init(grunt);
  var errorCount = 0;

  // Handle any number of namespaced events like so.
  phantomjs.on('mytask.ok', function(msg) {
    grunt.log.writeln(msg);
  });

  phantomjs.on('mytask.error', function(msg) {
    errorCount++;
    grunt.log.error(msg);
  });

  // Create some kind of "all done" event.
  phantomjs.on('mytask.done', function() {
    phantomjs.halt();
  });

  // Built-in error handlers.
  phantomjs.on('fail.load', function(url) {
    phantomjs.halt();
    grunt.warn('PhantomJS unable to load URL.');
  });

  phantomjs.on('fail.timeout', function() {
    phantomjs.halt();
    grunt.warn('PhantomJS timed out.');
  });

  // This task is async.
  var done = this.async();

  // Spawn phantomjs
  phantomjs.spawn('test.html', {
    // Additional PhantomJS options.
    options: {},
    // Complete the task when done.
    done: function(err) {
      done(err || errorCount === 0);
    }
  });

});
```

And `test.html` looked something like this (note the "bridge" is hard-coded into this page and not injected):

```html
<!doctype html>
<html>
<head>
<script>

// Send messages to the parent PhantomJS process via alert! Good times!!
function sendMessage() {
  var args = [].slice.call(arguments);
  alert(JSON.stringify(args));
}

sendMessage('mytask.ok', 'Something worked.');
sendMessage('mytask.error', 'Something failed.');
sendMessage('mytask.done');

</script>
</head>
<body>
</body>
</html>
```

Then running Grunt would behave something like this:

```shell
$ grunt mytask
Running "mytask" task
Something worked.
>> Something failed.
Warning: Task "mytask" failed. Use --force to continue.

Aborted due to warnings.
```


## API

### phantomjs.halt()

Call this when everything has finished successfully, or when something horrible happens, and you need to clean up and abort.

### phantomjs.spawn(pageURL, options)

Spawn a `PhantomJS` process. The method returns a reference to the spawned process.  
This method has the following arguments:

#### pageURL

Type: `string`  
Default: no default value, the user has to set it explicitly.

URL or path to the page .html test file to run.

#### Options

Type: `object`

The options object has these possible properties:

##### done

Type: `function`  
Default: no default value, the user has to set it explicitly.

The callback to call when the task is done.

##### failCode

Type: `number`  
Default: 0

The error code to exit with when an Error occurs.

##### killTimeout

Type: `number`  
Default: `1000` ms

The timeout in milliseconds after which the PhantomJS process will be killed.

##### options (PhantomJS options)

Type: `object`  
Default: `{}`

Additional options to passe to `PhantomJS`. This object has the following properties:

###### timeout

Type: `number`  
Default: `undefined`

PhantomJS' timeout, in milliseconds.

###### inject

Type: `string|array`  
Default: `undefined`

One or multiple (array) JavaScript file names to inject into the page.

###### page

Type: `object`  
Default: `undefined`

An object of options for the PhantomJS [`page` object](https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage).

###### screenshot

Type: `boolean`  
Default: `undefined`

Saves a screenshot on failure


## OS Dependencies

PhantomJS requires these dependencies on Ubuntu/Debian:

```
apt-get install libfontconfig1 fontconfig libfontconfig1-dev libfreetype6-dev
```
