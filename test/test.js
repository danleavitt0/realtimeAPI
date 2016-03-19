var test = require('tape')
var API = require('./testAPI')
var WebSocket = require('ws')
var ws = new WebSocket('ws://localhost:3000')
var id = 1
require('../lib/index')(API, 3000)

ws.on('open', function () {
  test('realtime server', function (t) {
    t.plan(1)
    ws.send(JSON.stringify({
      type: 'ping',
      id: id++
    }))
    ws.on('message', function (data) {
      data = JSON.parse(data)
      t.equals(id - 1, data.reply_id)
      t.end()
    })
  })
})
