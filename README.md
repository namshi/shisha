<img align="right" src="https://raw.githubusercontent.com/namshi/shisha/master/bin/images/shisha.png?token=328420__eyJzY29wZSI6IlJhd0Jsb2I6bmFtc2hpL3NoaXNoYS9tYXN0ZXIvYmluL2ltYWdlcy9zaGlzaGEucG5nIiwiZXhwaXJlcyI6MTQwOTMzNTU4Mn0%3D--d1d9d95754c28d8e33237e0f43454573e6da21ee" />

# Shisha, smoke tests made easy!

[![Build Status](https://travis-ci.org/namshi/shisha.svg?branch=master)](https://travis-ci.org/namshi/shisha)

Shisha is a [smoke testing](http://en.wikipedia.org/wiki/Smoke_testing)
library written in NodeJs. Simply provide a list of URLs and expected
status codes and Shisha will take care of testing them!

# Installation

You can install this library through [NPM](https://www.npmjs.org/package/shisha):

```
npm install -g shisha
```

# Usage

In your project root directory, define a `.smoke` file:

```
http://example.org 200
http://example.org/about 200
http://example.org/isdf 404
http://example.org/private 403
```

then simply `cd` into your project's root and run `shisha`!

![example](https://raw.githubusercontent.com/namshi/shisha/master/bin/images/shisha-ok.png?token=328420__eyJzY29wZSI6IlJhd0Jsb2I6bmFtc2hpL3NoaXNoYS9tYXN0ZXIvYmluL2ltYWdlcy9zaGlzaGEtb2sucG5nIiwiZXhwaXJlcyI6MTQwOTMzOTQ5OX0%3D--b6bc6ac2f28e0d206736af23dcf4fcf4bcf138db)

# .smoke file

Defining the `.smoke` file is flexible, you can define your URLs with
variables in this form:

```
http://{{ domain1 }}/{{ path }}/some-url 200
http://{{ domain2 }}/{{ path }}/some-other-url 200
```

By calling `shisha --domain1 example.org --domain2 example.net --path api`, the locals are
populated automatically!

![example](https://raw.githubusercontent.com/namshi/shisha/master/bin/images/shisha-locals.png?token=328420__eyJzY29wZSI6IlJhd0Jsb2I6bmFtc2hpL3NoaXNoYS9tYXN0ZXIvYmluL2ltYWdlcy9zaGlzaGEtbG9jYWxzLnBuZyIsImV4cGlyZXMiOjE0MDkzNDExMTd9--782a2508a57d290a0c3c66124ddf52c59810a098)

Even more! You can define **any** text file with a list of URLs and expected status codes
and point shisha at them using the `--smoke` option `shisha --smoke ./my/other/project/.urls`

# Extending

To be able to extend shisha, simply:

``` javascript
npm install --save shisha

# then

var shisha = require('shisha');
```

Then, you will have access to the `smoke` method, that accepts following arguments:

* a path to the smoke file or an object / list that defines your resources
* a list of locals to replace in the smoke file: `{ domain1: 'example.org' }`
* a callback that is triggered when the smoke tests are completed.

``` javascript
shisha.smoke(filePath, options, callback)

# or, with an object:

var resources = [{
  url: 'http://google.com',
  status: 200
},{
  url: 'http://ahhhhhhhhh.com',
  status: 404
}];

shisha.smoke(resources, options, callback);

# or you can even use another
# data model:

var resources = {
  'http://google.com': 200,
  'http://ahhhhh.com': 404,
};

shisha.smoke(resources, options, callback);
```

If you do not have any locals, you can omit them:

``` javascript
shisha.smoke(filePath, callback)
```

# Tests

You can run tests locally with

```
npm test
```

The build is continuously run on [travis](https://travis-ci.org/namshi/shisha).

# Feedback

Add an issue, open a PR, drop us an email! We would love to hear from you!
