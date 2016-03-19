var WS = require('ws').Server
var isObject = require('@f/is-object')
var extend = require('@f/extend')
var Emitter = require('component-emitter')

module.exports = rtmServer

function rtmServer (API, port, cb) {
  API = API || function () {}
  port = port || 3000
  var server = new WS({ port: port })

  var sockets = {}
  var id = 0

  server.on('connection', function (socket) {
    var socketId = id++
    sockets[socketId] = socket

    API.messages.emit('open', socketId)

    API.messages.on(socketId, function (msg) {
      socket.send(success(null, msg))
    })

    socket.on('close', function () {
      delete sockets[socketId]
      API.messages.removeAllListeners(socketId)
      API.messages.emit('close', socketId)
    })

    socket.on('message', function (data) {
      data = JSON.parse(data)
      data.socketId = socketId
      API[data.type](data, function (err, val) {
        if (err) return socket.send(error(data.id, err))
        socket.send(success(data.id, val))
      })
    })
  })

  function success (id, value) {
    value = value || ''
    var res = {ok: true}
    if (id) res.reply_id = id
    if (isObject(value)) {
      res = extend(res, value)
    } else {
      res.value = value
    }
    return JSON.stringify(res)
  }

  function error (id, err) {
    return JSON.stringify({
      'ok': false,
      'reply_to': id,
      'message': err.message
    })
  }

  // noop messages
  if (!API.messages) {
    API.messages = new Emitter()
  }

  return server
}
