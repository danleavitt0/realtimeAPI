var test = require('tape')
var API = require('./testAPI')
var WebSocket = require('ws')
var server = require('../lib/index')(API, 3000)
var ws = new WebSocket('ws://localhost:3000')

test('realtime server positive response', function (t) {
  var id = 1

  t.plan(3)
  ws.on('open', function () {
    ws.send(JSON.stringify({
      type: 'ping',
      id: id
    }))
  })
  ws.on('message', function (data) {
    data = JSON.parse(data)
    t.ok(data.reply_id)
    t.ok(data.ok)
    t.equals(id, data.reply_id)
  })
})

test('realtime server negative response', function (t) {
  server.close()
  ws.close()
  ws = new WebSocket('ws://localhost:3000')
  server = require('../lib/index')(API, 3000)
  var id = 2

  t.plan(3)
  ws.on('open', function () {
    ws.send(JSON.stringify({
      type: 'pong',
      id: id
    }))
  })
  ws.on('message', function (data) {
    data = JSON.parse(data)
    t.ok(data.reply_id)
    t.notOk(data.ok)
    t.equals(id, data.reply_id)
    server.close()
    ws.close()
  })
})

test('open for testing', function () {
  ws = new WebSocket('ws://localhost:3000')
  server = require('../lib/index')(API, 3000)
})
