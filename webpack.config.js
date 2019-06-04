var path = require('path');

module.exports = {
  entry: ['./tests.js'],
  module: {
    noParse: [/vendor\//]
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
};
