var parse = require('irc-parse');

[
  ':nick!ident@host.com PRIVMSG me :Hello world',
  '@aaa=bbb;ccc;example.com/ddd=eee :nick!ident@host.com PRIVMSG me :Hello world',
  'COMMAND',
  ':prefix COMMAND what if I do a command with tons of args',
  'COMMAND  spaces    get  compressed   :   except   in   the trailing  ',
  'COMMAND : :',
  'COMMAND ::',
  'COMMAND :',
  ''
].forEach(function (line) {
  console.dir(line);
  var msg = parse(line);
  console.dir(msg);
  var str = parse.serialize(msg);
  console.dir(str);
  console.log();
});