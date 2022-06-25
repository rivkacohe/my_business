const path = require('path');
const fs = require('fs');

module.exports = {
  getHtmlFilePath: function (htmlFileName) {
    return path.join(__dirname, '../public', htmlFileName);
  },
}