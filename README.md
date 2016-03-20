# rtm-server

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

A realtime API web socket server.

## Installation

    $ npm install rtm-server

## Usage

```js
var RTMServer = require('rtm-server')
var server = RTMServer(API, 3000)
```

## API

### RTMServer(API, port)

- `API` - Object with API endpoints
- `port` - Number of desired port

**Returns:** `Websocket instance`

## License

MIT

[travis-image]: https://img.shields.io/travis/danleavitt0/rtm-server.svg
[travis-url]: https://travis-ci.org/danleavitt0/rtm-server
[git-image]: https://img.shields.io/github/tag/danleavitt0/rtm-server.svg
[git-url]: https://github.com/danleavitt0/rtm-server
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/rtm-server.svg
[npm-url]: https://npmjs.org/package/rtm-server
