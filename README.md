# get-stack-trace

[![NPM version](http://img.shields.io/npm/v/get-stack-trace.svg?style=flat-square)](https://www.npmjs.org/package/get-stack-trace)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Stack traces as an array of stack frames with source maps support.

## Usage

```js
import {
  getStackTrace,
  serializeStackTrace,
} from 'get-stack-trace';

const stackTrace = getStackTrace();

serializeStackTrace('Error', 'Hello, World!', stackTrace);
```
