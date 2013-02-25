var strsplit = require('strsplit')

var SPACE = /\s+/;

function parse(str) {
  var msg = {};
  
  if (str[0] === '@') {
    var m = strsplit(str.slice(1), SPACE, 2);
    str = m[1];
    msg.tags = {};
    strsplit(m[0], ';').forEach(function (t) {
      var m = strsplit(t, '=', 2);
      msg.tags[m[0]] = m.length > 1 ? m[1] : true;
    });
  }
  
  if (str[0] === ':') {
    var m = strsplit(str.slice(1), SPACE, 2);
    str = m[1];
    msg.prefix = m[0];
  }
  
  var m = strsplit(str, SPACE, 2);
  str = m[1];
  msg.command = m[0];
  
  msg.params = [];
  
  while (str) {
    if (str[0] === ':') {
      msg.params.push(str.slice(1));
      str = '';
    } else {
      var m = strsplit(str, SPACE, 2);
      str = m[1];
      msg.params.push(m[0]);
    }
  }
  
  return msg;
}

function serialize(msg) {
  if (msg && msg.hasOwnProperty('command')) {
    var str = '';
    if (msg.tags && Object.keys(msg.tags).length > 0)
      str += '@' + Object.keys(msg.tags).map(function (key) {
        return msg.tags[key] === true ? key : key + '=' + msg.tags[key];
      }).join(';') + ' ';
  
    if (msg.prefix)
      str += ':' + msg.prefix + ' ';
  
    str += msg.command;
  
    if (msg.hasOwnProperty('params')) {
      var params = msg.params.slice();
      if (params.length > 0) {
        var trail = params.pop();
        if (trail[0] === ':' || SPACE.test(trail) || trail.length === 0)
          trail = ':' + trail;
        params.push(trail);
        str += ' ' + params.join(' ');
      }
    }
  
    return str;
  }
}

parse.parse = parse;
parse.serialize = serialize;
parse.SPACE = SPACE;

module.exports = parse;