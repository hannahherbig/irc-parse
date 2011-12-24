var net = require('net');
var events = require('events');
var util = require('util');

var numerics = require('./numerics');

function parse(str) {
  var origin = null;
  var command = null;
  var args = [];
  var i;

  // pull out the origin if there is one
  if (str[0] === ':') {
    i = str.indexOf(' ');
    origin = str.slice(1, i);
    str = str.slice(i + 1);
  }

  // pull out the command
  i = str.indexOf(' ');
  command = str.slice(0, i);
  str = str.slice(i + 1);

  // get the args
  i = str.indexOf(' :');
  if (i !== -1) {
    args = str.slice(0, i).split(/\s+/);
    args.push(str.slice(i + 2));
  } else
    args = str.split(/\s+/);

  args.origin = origin;
  args.command = command;

  return args;
}

function lineBuffer(callback) {
  var buffer = '';
  return function(data) {
    var i;
    buffer += data;
    while((i = buffer.indexOf('\n')) != -1) {
      callback(buffer.slice(0, i).trim());
      buffer = buffer.slice(i + 1);
    }
  }
}

function Server(clientListener) {
  net.Server.call(this);

  if (clientListener)
    this.on('client', clientListener);

  this.on('connection', function (socket) {
    this.emit('client', new Client(socket, this));
  });
}
util.inherits(Server, net.Server);

function Client(socket, server) {
  this.socket = socket;
  this.server = server;
  socket.on('data', lineBuffer(function (line) {
    this.emit('raw', line);
  }.bind(this)));

  this.on('raw', function (line) {
    var args = parse(line);
    this.emit('command', args);
    this.emit(args.command, args);
  });
}
util.inherits(Client, events.EventEmitter);

Client.prototype.send = function (line) {
  this.socket.write(line + "\r\n");
}

exports.numerics = numerics;
exports.parse = parse;
exports.Server = Server;
exports.Client = Client;
