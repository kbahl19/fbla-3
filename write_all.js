const fs = require('fs');
const base = 'C:/Users/Bahlk/OneDrive/Desktop/Clubs/FBLA/petpal/src';

function w(path, content) {
  fs.writeFileSync(base + '/' + path, content, {encoding: 'utf8'});
  const lines = content.split('\n').length;
  console.log('Written ' + path + ' (' + lines + ' lines)');
}

