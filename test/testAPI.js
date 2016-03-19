var Emitter = require('component-emitter')

exports.ping = ping
exports.messages = new Emitter()

function ping (data, cb) {
  cb(null, true)
}
