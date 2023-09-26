# get-stack-trace

[![NPM version](http://img.shields.io/npm/v/get-stack-trace.svg?style=flat-square)](https://www.npmjs.org/package/get-stack-trace)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

[V8 stack traces](https://github.com/v8/v8/wiki/Stack-Trace-API) as an object.

## Usage

```js
import {
  getStackTrace,
  serializeStackTrace,
} from 'get-stack-trace';

const stackTrace = getStackTrace();

serializeStackTrace('Error', 'Hello, World!', stackTrace);
```
