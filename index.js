var SPACE = /\s+/;
var SPACECOLON = /\s+:/;

// Message has the following properties:
// - original - string - the original string
// - origin - string
// - command - string
// - args - array of strings
function Message (str) {
  if (!(this instanceof Message))
    return new Message(str);
  
  var i;
  
  this.original = str;
  
  // pull out the origin if there is one
  if (str[0] === ':') {
    i = str.search(SPACE);
    this.origin = str.slice(1, i);
    str = str.slice(i + 1);
  } else
    this.origin = null;
  
  // pull out the command
  i = str.search(SPACE);
  if (i === -1) {
    this.command = str;
    this.args = [];
  } else {
    this.command = str.slice(0, i);
    str = str.slice(i + 1);
  
    // get the args
    i = str.search(SPACECOLON);
    if (i !== -1)
      this.args = str.slice(0, i).split(SPACE).concat(str.slice(i + 2));
    else
      this.args = str.split(SPACE);
  }
}

module.exports = Message;
