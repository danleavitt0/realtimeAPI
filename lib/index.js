var WS = require('ws').Server
var isObject = require('@f/is-object')
var extend = require('@f/extend')
var Emitter = require('component-emitter')

module.exports = rtmServer

function rtmServer (API, port) {
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
      API.messages.emit('close', socketId)
      API.messages.removeAllListeners(socketId)
    })

    socket.on('message', function (data) {
      data = JSON.parse(data)
      data.socketId = socketId
      if (API && API[data.type]) {
        API[data.type](data, function (err, val) {
          if (err) return socket.send(error(data.id, err))
          try {
            socket.send(success(data.id, val))
          } catch (e) {
            console.warn(e)
          }
        })
      } else {
        try {
          socket.send(error(data.id, 'Could not find method ' + data.type + ' on API'))
        } catch (e) {
          console.warn(e)
        }
      }
    })
  })

  function success (id, value) {
    value = value || ''
    var res = {ok: true}
    if (id) res.reply_id = id
    if (value) res.value = value
    return JSON.stringify(res)
  }

  function error (id, err) {
    return JSON.stringify({
      'ok': false,
      'reply_id': id,
      'value': err.message
    })
  }

  // noop messages
  if (!API.messages) {
    API.messages = new Emitter()
  }

  return server
}
